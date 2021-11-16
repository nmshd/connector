import { ConnectorClient } from "@nmshd/connector-sdk";
import { ChildProcess, spawn } from "child_process";
import getPort from "get-port";
import path from "path";
import waitOn from "wait-on";

export class Launcher {
    private readonly _processes: ChildProcess[] = [];

    private spawnConnector(port: number, accountName: string) {
        const env = process.env;
        env["INFRASTRUCTURE__HTTP_SERVER__PORT"] = port.toString();
        env.NODE_CONFIG_ENV = "test";
        env.DATABASE_NAME = accountName;
        return spawn("node_modules/.bin/ts-node", ["src/index.ts"], {
            env: env,
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

        await waitOn({ resources: resources });

        return clients;
    }

    private randomString(): string {
        return Math.random().toString(36).substring(7);
    }

    public stop(): void {
        this._processes.forEach((p) => p.kill());
    }
}
