#!/usr/bin/env node

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    const oclif = await import("@oclif/core");
    process.env.NODE_ENV = "prod";
    process.env["CONNECTOR_CLI"] = true;
    await oclif.execute({ dir: __dirname });
})();
