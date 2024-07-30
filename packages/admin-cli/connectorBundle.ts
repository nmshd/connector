/* eslint-disable no-console */
import * as esbuild from "esbuild";

function externalizeAllPackagesExcept() {
    return <esbuild.Plugin>{
        name: "externalize-all-except-connector",
        setup(build) {
            build.onResolve({ filter: /(.*)/ }, (args): any => {
                if (args.kind === "import-statement" || args.kind === "require-call") {
                    if (args.path.startsWith("./") || args.path.startsWith("../")) {
                        return;
                    }

                    if (args.path === "@nmshd/connector") {
                        return;
                    }
                    return { path: args.path, external: true };
                }
            });
        }
    };
}

(async () => {
    const result = await esbuild.build({
        entryPoints: ["src/connector.ts"],
        outfile: "dist/connector.js",
        bundle: true,
        platform: "node",
        sourcemap: true,
        plugins: [externalizeAllPackagesExcept()]
    });

    result.outputFiles?.forEach((file) => {
        console.log(`Generated file: ${file.path}`);
    });

    result.warnings.forEach((warning) => {
        console.warn(warning);
    });

    result.errors.forEach((error) => {
        console.error(error);
    });
})().catch((error) => {
    console.log(error);
    process.exit(1);
});
