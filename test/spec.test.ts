import * as ts from "typescript";
import yamljs from "yamljs";

import { MetadataGenerator, SpecGenerator, Swagger } from "typescript-rest-swagger";

import tsConfigBase from "../tsconfig.json";

describe("test openapi spec against routes", () => {
    test("all route names should match the generated ones", async () => {
        const manualOpenApiSpec: Swagger.Spec = yamljs.load("src/modules/coreHttpApi/openapi.yml");

        const files = "src/modules/**/*.ts";

        const tsConfig = ts.convertCompilerOptionsFromJson(tsConfigBase.compilerOptions, process.cwd()).options;
        const metadata = new MetadataGenerator([files], tsConfig).generate();
        const defaultOptions = {
            basePath: "/",
            collectionFormat: "",
            description: "",
            entryFile: files,
            host: "localhost:3000",
            license: "",
            name: "",
            outputDirectory: "",
            version: "",
            yaml: false
        };
        const generator = new SpecGenerator(metadata, defaultOptions);
        const generatedOpenApiSpec: Swagger.Spec = await generator.getOpenApiSpec();
        harmonizeSpec(manualOpenApiSpec);
        harmonizeSpec(generatedOpenApiSpec);

        const manualPaths = Object.keys(manualOpenApiSpec.paths);
        const generatedPaths = Object.keys(generatedOpenApiSpec.paths);

        generatedPaths.forEach((path) => {
            expect(manualPaths).toContain(path);
        });

        // Paths not defined in the typescript-rest way
        const ignorePaths = ["/health", "/Monitoring/Version", "/Monitoring/Requests", "/Monitoring/Support"];
        // Paths to ignroe in regard to return code consistencie (Post requests that return 200 due to no creation)
        /* eslint-disable @typescript-eslint/naming-convention */
        const returnCodeOvererite: Record<string, string | undefined> = {
            "/api/v2/Account/Sync": "200",
            "/api/v2/Attributes/ExecuteIQLQuery": "200",
            "/api/v2/Attributes/ValidateIQLQuery": "200",
            "/api/v2/Challenges/Validate": "200"
        };
        /* eslint-enable @typescript-eslint/naming-convention */

        manualPaths.forEach((path) => {
            if (ignorePaths.includes(path)) {
                return;
            }

            expect(generatedPaths).toContain(path);

            const generatedMethods = Object.keys(generatedOpenApiSpec.paths[path])
                .map((method) => method.toLocaleLowerCase())
                .sort();
            const manualMethods = Object.keys(manualOpenApiSpec.paths[path])
                .map((method) => method.toLocaleLowerCase())
                .sort();

            expect(generatedMethods, `Path ${path} do not have the same methods`).toStrictEqual(manualMethods);

            Object.keys(manualOpenApiSpec.paths[path]).forEach((method) => {
                const key = method as "get" | "put" | "post" | "delete" | "options" | "head" | "patch";
                const manualResponses = Object.keys(manualOpenApiSpec.paths[path][key]?.responses ?? {});
                let expectedResponseCode = key === "post" ? "201" : "200";
                expectedResponseCode = returnCodeOvererite[path] ?? expectedResponseCode;
                expect(manualResponses, `Path ${path} and method ${method} does not contain response code ${expectedResponseCode}`).toContainEqual(expectedResponseCode);
            });
        });
    });
});

function harmonizeSpec(spec: any) {
    for (const path in spec.paths) {
        const newPath = path.replaceAll(/\{.*?\}/g, "{param}");
        if (path !== newPath) {
            spec.paths[newPath] = spec.paths[path];
            delete spec.paths[path];
        }
    }
}
