#!/usr/bin/env node

import { OpenTelemetry } from "./OpenTelemetry";

const openTelemetry = OpenTelemetry.initialize();
process.once("beforeExit", () => openTelemetry.shutdown());

async function bootstrap(): Promise<void> {
    // Auto-instrumentation must be registered before application dependencies are loaded.
    const { main } = await import("./main");
    await main();
}

bootstrap().catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
    await openTelemetry.shutdown();
});
