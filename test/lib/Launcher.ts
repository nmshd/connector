import { ConnectorClient } from "@nmshd/connector-sdk";
import { ChildProcess, spawn } from "child_process";
import path from "path";
import getPort from "./getPort";
import waitForConnector from "./waitForConnector";

export class Launcher {
    private readonly _processes: ChildProcess[] = [];
    private readonly apiKey = "xxx";

    private spawnConnector(port: number, accountName: string) {
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

        return spawn("node", ["dist/index.js"], {
            env: { ...process.env, ...env },
            cwd: path.resolve(`${__dirname}/../..`),
            stdio: "inherit"
        });
    }

    public async launchSimple(): Promise<string> {
        const port = await getPort();
        const accountName = this.randomString();

        this._processes.push(this.spawnConnector(port, accountName));

        await waitForConnector(port);

        return `http://localhost:${port}`;
    }

    public async launch(count: number): Promise<ConnectorClient[]> {
        const clients: ConnectorClient[] = [];
        const ports: number[] = [];

        for (let i = 0; i < count; i++) {
            const port = await getPort();
            clients.push(ConnectorClient.create({ baseUrl: `http://localhost:${port}`, apiKey: this.apiKey }));
            ports.push(port);

            const accountName = this.randomString();
            this._processes.push(this.spawnConnector(port, accountName));
        }

        await Promise.all(ports.map(waitForConnector));
        return clients;
    }

    private randomString(): string {
        return Math.random().toString(36).substring(7);
    }

    public stop(): void {
        this._processes.forEach((p) => p.kill());
    }
}
