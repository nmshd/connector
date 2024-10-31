import { ConnectorClient } from "@nmshd/connector-sdk";
import { Random, RandomCharacterRange } from "@nmshd/transport";
import { ChildProcess, spawn } from "child_process";
import express from "express";
import http, { Server } from "node:http";
import https from "node:https";
import inspector from "node:inspector";
import path from "path";
import { DataEventWithHeaders } from "./DataEventWithHeader";
import { MockEventBus } from "./MockEventBus";
import getPort from "./getPort";
import waitForConnector from "./waitForConnector";

export type ConnectorClientWithMetadata = ConnectorClient & {
    /* eslint-disable @typescript-eslint/naming-convention */
    _metadata?: Record<string, string>;
    _eventBus?: MockEventBus;
    /* eslint-enable @typescript-eslint/naming-convention */
};

export class Launcher {
    private readonly _processes: { connector: ChildProcess; webhookServer: Server | undefined }[] = [];
    private readonly apiKey = "xxx";

    public async launchSimple(): Promise<string> {
        const port = await getPort();
        const accountName = await this.randomString();
        const { connector, webhookServer } = await this.spawnConnector(port, accountName);
        this._processes.push({
            connector,
            webhookServer
        });
        try {
            await waitForConnector(port, connector);
        } catch (e) {
            this.stopClient(connector, webhookServer);
            throw e;
        }

        return `http://localhost:${port}`;
    }

    public async launch(count: number): Promise<ConnectorClientWithMetadata[]> {
        const clients: ConnectorClientWithMetadata[] = [];
        const ports: number[] = [];
        const startPromises: Promise<void>[] = [];

        const debugging = !!inspector.url();
        for (let i = 0; i < count; i++) {
            const port = await getPort();
            const accountName = `${i + 1}-${await this.randomString()}`;

            const connectorClient = ConnectorClient.create({
                baseUrl: `http://localhost:${port}`,
                apiKey: this.apiKey,
                httpAgent: debugging ? new http.Agent({ keepAlive: false }) : undefined,
                httpsAgent: debugging ? new https.Agent({ keepAlive: false }) : undefined
            }) as ConnectorClientWithMetadata;
            connectorClient["_metadata"] = { accountName: `acc-${accountName}` };

            connectorClient._eventBus = new MockEventBus();

            clients.push(connectorClient);
            ports.push(port);
            const { connector, webhookServer } = await this.spawnConnector(port, accountName, connectorClient._eventBus);
            this._processes.push({
                connector,
                webhookServer
            });

            startPromises.push(
                new Promise((resolve, reject) => {
                    waitForConnector(port, connector)
                        .then(resolve)
                        .catch((e: Error) => {
                            this.stopClient(connector, webhookServer);
                            reject(e);
                        });
                })
            );
        }

        await Promise.all(startPromises);
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
            connector: spawn("node", ["dist/index.js", "start"], {
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

                eventBus.publish(new DataEventWithHeaders(req.body.trigger, req.body.data, req.headers));
            })
            .listen(port);
    }

    public stop(): void {
        this._processes.forEach((p) => {
            const { connector, webhookServer } = p;
            this.stopClient(connector, webhookServer);
        });
    }

    public stopClient(connector: ChildProcess, webhookServer: Server | undefined): void {
        connector.kill();
        webhookServer?.close();
    }
}
