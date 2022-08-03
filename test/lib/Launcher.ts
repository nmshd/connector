import { ConnectorClient } from "@nmshd/connector-sdk";
import { ChildProcess, spawn } from "child_process";
import path from "path";
import waitOn from "wait-on";
import getPort from "./getPort";

export class Launcher {
    private readonly _processes: ChildProcess[] = [];

    private spawnConnector(port: number, accountName: string) {
        const env = process.env;
        env["infrastructure:httpServer:port"] = port.toString();
        env.NODE_CONFIG_ENV = "test";
        env.DATABASE_NAME = accountName;
        return spawn("node", ["dist/index.js"], {
            env,
            cwd: path.resolve(`${__dirname}/../..`),
            stdio: "inherit"
        });
    }

    public async launchSimple(): Promise<string> {
        const port = await getPort();
        const accountName = this.randomString();

        this._processes.push(this.spawnConnector(port, accountName));

        await waitOn({ resources: [`tcp:localhost:${port}`] });

        return `http://localhost:${port}`;
    }

    public async launch(count: number): Promise<ConnectorClient[]> {
        const clients = [];
        const resources = [];

        for (let i = 0; i < count; i++) {
            const port = await getPort();
            clients.push(ConnectorClient.create({ baseUrl: `http://localhost:${port}`, apiKey: "xxx" }));
            resources.push(`tcp:localhost:${port}`);

            const accountName = this.randomString();
            this._processes.push(this.spawnConnector(port, accountName));
        }

        await waitOn({ resources });

        return clients;
    }

    private randomString(): string {
        return Math.random().toString(36).substring(7);
    }

    public stop(): void {
        this._processes.forEach((p) => p.kill());
    }
}
