import { ConnectorClient } from "@nmshd/connector-sdk";
import { Random, RandomCharacterRange } from "@nmshd/transport";
import { ChildProcess, spawn } from "child_process";
import express from "express";
import { Server } from "http";
import path from "path";
import getPort from "./getPort";
import waitForConnector from "./waitForConnector";

interface EventData {
    trigger: string;
    data: any;
}

export type ConnectorClientWithMetadata = ConnectorClient & {
    /* eslint-disable @typescript-eslint/naming-convention */
    _metadata?: Record<string, string>;
    _events: {
        getEvents(name: string): EventData[];
        startEventLog(name: string): void;
        stopEventLog(name: string): void;
    };
    /* eslint-enable @typescript-eslint/naming-convention */
};

export class Launcher {
    private readonly _processes: { connector: ChildProcess; webhookServer: Server }[] = [];
    private readonly apiKey = "xxx";
    private readonly events: Record<string, EventData[] | undefined> = {};

    private startWebHookServer(port: number): Server {
        const app = express();

        app.use(express.json());
        app.use((req, res) => {
            Object.keys(this.events).forEach((key) => {
                this.events[key]?.push(req.body);
            });
            res.send("OK");
        });

        return app.listen(port);
    }

    private async spawnConnector(port: number, accountName: string) {
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

        const webhookServerPort = await getPort();
        env["modules:webhooks:webhooks"] = JSON.stringify([
            {
                triggers: ["**"],
                target: { url: `http://localhost:${webhookServerPort}` }
            }
        ]);
        // `http://localhost:${webhookServerPort}`;

        const webhookServer = this.startWebHookServer(webhookServerPort);

        return {
            connector: spawn("node", ["dist/index.js"], {
                env: { ...process.env, ...env },
                cwd: path.resolve(`${__dirname}/../..`),
                stdio: "inherit"
            }),
            webhookServer
        };
    }

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
            connectorClient._events = {
                getEvents: (name: string): EventData[] => {
                    return this.events[name] ?? [];
                },

                startEventLog: (name: string): void => {
                    this.events[name] = [];
                },

                stopEventLog: (name: string): void => {
                    delete this.events[name];
                }
            };
            clients.push(connectorClient);
            ports.push(port);

            const accountName = await this.randomString();
            this._processes.push(await this.spawnConnector(port, accountName));
        }

        await Promise.all(ports.map(waitForConnector));
        return clients;
    }

    public async randomString(): Promise<string> {
        return await Random.string(7, RandomCharacterRange.Alphabet);
    }

    public stop(): void {
        this._processes.forEach((p) => {
            p.connector.kill();
            p.webhookServer.close();
        });
    }
}
