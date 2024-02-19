import { DataEvent } from "@js-soft/ts-utils";
import { ConnectorClient } from "@nmshd/connector-sdk";
import { Random, RandomCharacterRange } from "@nmshd/transport";
import { ChildProcess, spawn } from "child_process";
import express from "express";
import { Server } from "http";
import path from "path";
import { MockEventBus } from "./MockEventBus";
import getPort from "./getPort";
import waitForConnector from "./waitForConnector";

interface EventData {
    trigger: string;
    data: any;
}

export type ConnectorClientWithMetadata = ConnectorClient & {
    /* eslint-disable @typescript-eslint/naming-convention */
    _metadata?: Record<string, string>;
    _eventBus?: MockEventBus;
    /* eslint-enable @typescript-eslint/naming-convention */
};

export class Launcher {
    private readonly _processes: { connector: ChildProcess; webhookServer: Server | undefined }[] = [];
    private readonly apiKey = "xxx";
    private readonly events: Record<string, EventData[] | undefined> = {};

    public async launchSimple(): Promise<string> {
        const port = await getPort();
        const accountName = await this.randomString();

        this._processes.push(await this.spawnConnector(port, accountName));

        await waitForConnector(port);

        return `http://localhost:${port}`;
    }

    public async launch(count: number): Promise<ConnectorClientWithMetadata[]> {
        const clients: ConnectorClientWithMetadata[] = [];
        const ports: number[] = [];

        for (let i = 0; i < count; i++) {
            const port = await getPort();
            const connectorClient = ConnectorClient.create({ baseUrl: `http://localhost:${port}`, apiKey: this.apiKey }) as ConnectorClientWithMetadata;

            connectorClient._eventBus = new MockEventBus();

            clients.push(connectorClient);
            ports.push(port);

            const accountName = await this.randomString();
            this._processes.push(await this.spawnConnector(port, accountName, connectorClient._eventBus));
        }

        await Promise.all(ports.map(waitForConnector));
        return clients;
    }

    private async randomString(): Promise<string> {
        return await Random.string(7, RandomCharacterRange.Alphabet);
    }

    private async spawnConnector(port: number, accountName: string, eventBus?: MockEventBus) {
        const env = process.env;
        env["infrastructure:httpServer:port"] = port.toString();
        env["infrastructure:httpServer:apiKey"] = this.apiKey;

        const notDefinedEnvironmentVariables = ["NMSHD_TEST_BASEURL", "NMSHD_TEST_CLIENTID", "NMSHD_TEST_CLIENTSECRET"].filter((env) => !process.env[env]);
        if (notDefinedEnvironmentVariables.length > 0) {
            throw new Error(`Missing environment variable(s): ${notDefinedEnvironmentVariables.join(", ")}}`);
        }

        env["transportLibrary:baseUrl"] = process.env["NMSHD_TEST_BASEURL"];
        env["transportLibrary:platformClientId"] = process.env["NMSHD_TEST_CLIENTID"];
        env["transportLibrary:platformClientSecret"] = process.env["NMSHD_TEST_CLIENTSECRET"];

        env.NODE_CONFIG_ENV = "test";
        env.DATABASE_NAME = accountName;

        let webhookServer: Server | undefined;
        if (eventBus) {
            const webhookServerPort = await getPort();
            env["modules:webhooks:enabled"] = "true";
            env["modules:webhooks:targets:test:url"] = `http://localhost:${webhookServerPort}`;
            webhookServer = this.startWebHookServer(webhookServerPort, eventBus);
        }

        return {
            connector: spawn("node", ["dist/index.js"], {
                env: { ...process.env, ...env },
                cwd: path.resolve(`${__dirname}/../..`),
                stdio: "inherit"
            }),
            webhookServer
        };
    }

    private startWebHookServer(port: number, eventBus: MockEventBus): Server {
        return express()
            .use(express.json())
            .use((req, res) => {
                res.status(200).send("OK");

                eventBus.publish(new DataEvent(req.body.trigger, req.body.data));
            })
            .listen(port);
    }

    public stop(): void {
        this._processes.forEach((p) => {
            p.connector.kill();
            p.webhookServer?.close();
        });
    }
}
