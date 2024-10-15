#!/usr/bin/env node
import { command } from "./ConnectorCli";

const argv = command.parse();

Promise.resolve(argv).catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});
