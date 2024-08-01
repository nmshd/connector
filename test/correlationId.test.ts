import { sleep } from "@js-soft/ts-utils";
import axios, { AxiosInstance } from "axios";
import { ChildProcess } from "child_process";
import { randomUUID } from "crypto";
import { Server } from "http";
import { Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";

const launcher = new Launcher();
let axiosClient: AxiosInstance;
let launchResult: { baseUrl: any; processes?: { connector: ChildProcess; webhookServer: Server | undefined } };
const uuidRegex = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");

beforeAll(async () => {
    process.env["logging:appenders:console:level"] = "INFO";
    launchResult = await launcher.launchSimple(true);
    axiosClient = axios.create({
        baseURL: launchResult.baseUrl,
        validateStatus: (_) => true
    });
}, getTimeout(30000));

afterAll(() => launcher.stop());
describe("should log the correlation id", () => {
    test("should log the correlation id", async () => {
        let correlationIdFound = false;
        launchResult.processes?.connector.stdout?.on("data", (data: Buffer) => {
            const logOutput = data.toString();
            // eslint-disable-next-line jest/no-conditional-in-test
            if (logOutput.includes("/Monitoring/Version") && logOutput.match(uuidRegex)) {
                correlationIdFound = true;
            }
        });
        await axiosClient.get<any>("/Monitoring/Version", {
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "X-API-KEY": "xxx"
            }
        });
        let timeoutRun = false;
        const timeout = setTimeout(() => {
            timeoutRun = true;
            throw new Error("CorrelationId not found");
        }, 5000);
        // eslint-disable-next-line no-unmodified-loop-condition, @typescript-eslint/no-unnecessary-condition, jest/no-conditional-in-test
        while (!correlationIdFound && !timeoutRun) {
            await sleep(500);
        }
        clearTimeout(timeout);
        expect(correlationIdFound).toBe(true);
    });

    test("should log the custom correlation id", async () => {
        let correlationIdFound = false;
        const customCorrelationId = randomUUID();
        launchResult.processes?.connector.stdout?.on("data", (data: Buffer) => {
            const logOutput = data.toString();
            // eslint-disable-next-line jest/no-conditional-in-test
            if (logOutput.includes("/Monitoring/Version") && logOutput.includes(customCorrelationId)) {
                correlationIdFound = true;
            }
        });

        await axiosClient.get<any>("/Monitoring/Version", {
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "X-API-KEY": "xxx",
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "x-correlation-id": customCorrelationId
            }
        });
        let timeoutRun = false;
        const timeout = setTimeout(() => {
            timeoutRun = true;
            throw new Error("CorrelationId not found");
        }, 5000);
        // eslint-disable-next-line no-unmodified-loop-condition, @typescript-eslint/no-unnecessary-condition, jest/no-conditional-in-test
        while (!correlationIdFound && !timeoutRun) {
            await sleep(500);
        }
        clearTimeout(timeout);

        expect(correlationIdFound).toBe(true);
    });
});
