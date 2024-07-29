import { NodeLoggerFactory } from "@js-soft/node-logger";
import { sleep } from "@js-soft/ts-utils";
import axios, { Axios } from "axios";
import { CLIRuntime } from "../../src/CLIRuntime";
import { createConnectorConfig } from "../../src/connector";

let adminClient: Axios | undefined;

export async function getBackboneAdminApiClient(): Promise<Axios> {
    if (adminClient) return adminClient;

    const adminAPIBaseUrl = process.env.NMSHD_TEST_BASEURL_ADMIN_API;
    if (!adminAPIBaseUrl) throw new Error("Missing environment variable NMSHD_TEST_BASEURL_ADMIN_API");
    const csrf = await axios.get(`${adminAPIBaseUrl}/api/v1/xsrf`, {
        headers: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
            "x-api-key": process.env.NMSHD_TEST_ADMIN_API_KEY!
        }
    });
    adminClient = axios.create({
        baseURL: adminAPIBaseUrl,
        headers: {
            /* eslint-disable @typescript-eslint/naming-convention */
            cookie: csrf.headers["set-cookie"],
            "x-xsrf-token": csrf.data,
            "x-api-key": process.env.NMSHD_TEST_ADMIN_API_KEY!
            /* eslint-enable @typescript-eslint/naming-convention */
        }
    });
    return adminClient;
}

export async function startIdentityDeletionProcessFromBackboneAdminApi(accountAddress: string): Promise<void> {
    const adminApiClient = await getBackboneAdminApiClient();
    await adminApiClient.post<{ result: { id: string } }>(`/api/v1/Identities/${accountAddress}/DeletionProcesses`);

    const config = createConnectorConfig();
    // (config.logging.appenders.console as any)["level"] = "TRACE";
    const loggerFactory = new NodeLoggerFactory(config.logging);
    const cliRuntime = new CLIRuntime(config, loggerFactory);
    await cliRuntime.init();
    await cliRuntime.start();

    let eventFired = false;
    let promise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Timeout waiting for identity deletion process sync to finish"));
        }, 10000);
        cliRuntime.eventBus.subscribeOnce("transport.identityDeletionProcessStatusChanged", () => {
            clearTimeout(timeout);
            resolve();
        });
    });
    promise = promise.then(() => {
        eventFired = true;
    });

    let count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-unmodified-loop-condition
    while (!eventFired) {
        if (count > 10) {
            throw new Error("Timeout waiting for identity deletion process sync to finish");
        }
        await cliRuntime.getServices().transportServices.account.syncEverything();
        await sleep(1000);
        count++;
    }
    await promise;
    await cliRuntime.stop();
}
