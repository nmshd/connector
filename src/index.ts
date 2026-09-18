#!/usr/bin/env node

import { OpenTelemetry } from "./openTelemetry/OpenTelemetry";

const openTelemetry = OpenTelemetry.initialize();
process.once("beforeExit", () => openTelemetry.shutdown());

async function bootstrap(): Promise<void> {
    // OpenTelemetry adds tracing to supported libraries when they are first loaded. Importing the
    // application only after initialization ensures those libraries are instrumented; a static
    // top-level import of `main` would load them too early and their operations would not create spans.
    const { main } = await import("./main");
    await main(() => openTelemetry.shutdown());
}

bootstrap().catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
    await openTelemetry.shutdown();
});
