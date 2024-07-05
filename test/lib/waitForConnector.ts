import { sleep } from "@js-soft/ts-utils";
import axios from "axios";
import { ChildProcess } from "child_process";
import { getTimeout as getRetryCount } from "./setTimeout";

export default async function waitForConnector(port: number, connectorProcess: ChildProcess): Promise<void> {
    const maxRetries = getRetryCount(10);
    const timeout = 1000;

    const axiosInstance = axios.create({
        baseURL: `http://localhost:${port}`,
        validateStatus: (status) => status === 200
    });

    for (let tries = 0; tries < maxRetries; tries++) {
        await sleep(timeout);
        const exitCode = connectorProcess.exitCode;
        if (exitCode !== null) {
            throw new Error(`Connector was closed with exit code ${exitCode} before the tests could run.`);
        }

        try {
            await axiosInstance.get("/health");
            return;
        } catch (_) {
            // ignore
        }
    }

    throw new Error(`Could not connect to port ${port} after ${maxRetries} retries.`);
}
