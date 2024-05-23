#!/usr/bin/env node_modules/.bin/ts-node
// eslint-disable-next-line node/shebang, unicorn/prefer-top-level-await
(async () => {
    const oclif = await import("@oclif/core");
    process.env["CONNECTOR_CLI"] = true;
    await oclif.execute({ development: true, dir: __dirname });
})();
