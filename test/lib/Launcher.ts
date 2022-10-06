import { ConnectorClient } from "@nmshd/connector-sdk";
import { ChildProcess, spawn } from "child_process";
import path from "path";
import getPort from "./getPort";
import simpleWaitOn from "./simpleWaitOn";

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

        await simpleWaitOn(port);

        return `http://localhost:${port}`;
    }

    public async launch(count: number): Promise<ConnectorClient[]> {
        const clients: ConnectorClient[] = [];
        const ports: number[] = [];

        for (let i = 0; i < count; i++) {
            const port = await getPort();
            clients.push(ConnectorClient.create({ baseUrl: `http://localhost:${port}`, apiKey: "xxx" }));
            ports.push(port);

            const accountName = this.randomString();
            this._processes.push(this.spawnConnector(port, accountName));
        }

        await Promise.all(ports.map(simpleWaitOn));
        return clients;
    }

    private randomString(): string {
        return Math.random().toString(36).substring(7);
    }

    public stop(): void {
        this._processes.forEach((p) => p.kill());
    }
}
