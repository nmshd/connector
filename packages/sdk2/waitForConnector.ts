import { sleep } from "@js-soft/ts-utils";
import axios from "axios";

export default async function waitForConnector(port: number): Promise<void> {
    const maxRetries = 10;
    const timeout = 1000;

    const axiosInstance = axios.create({
        baseURL: `http://localhost:${port}`,
        validateStatus: (status) => status === 200
    });

    for (let tries = 0; tries < maxRetries; tries++) {
        await sleep(timeout);

        try {
            await axiosInstance.get("/health");
            return;
        } catch (_) {
            // ignore
        }
    }

    throw new Error(`Could not connect to port ${port} after ${maxRetries} retries.`);
}
