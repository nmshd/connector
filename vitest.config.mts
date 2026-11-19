import inspector from "node:inspector";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: ["dist-test/test/**/*.test.js"],
        setupFiles: ["dist-test/test/lib/validation.js", "dist-test/test/lib/customMatcher.js"],
        testTimeout: inspector.url() || process.env.NODE_OPTIONS?.includes("inspect") ? 1_000_000_000 : 60_000,
        hookTimeout: 60_000,
        maxWorkers: 1,
        coverage: {
            provider: "v8",
            autoAttachSubprocess: true,
            reportOnFailure: true,
            include: ["dist-test/src/**/*.js", "dist/**/*.js", "packages/sdk/dist/**/*.js"],
            reporter: ["lcov", "text-summary", "cobertura"]
        }
    },
    resolve: {
        alias: {
            "@verifiables/request-converter": resolve("node_modules/@verifiables/request-converter/dist/index.js"),
            "webcrypto-core": resolve("node_modules/webcrypto-core/build/webcrypto-core.js")
        }
    }
});
