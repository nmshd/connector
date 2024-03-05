import * as ts from "typescript";
import yamljs from "yamljs";

import { MetadataGenerator, SpecGenerator, Swagger } from "typescript-rest-swagger";

import swaggerParser from "@apidevtools/swagger-parser";
import tsConfigBase from "../tsconfig.json";

describe("test openapi spec against routes", () => {
    let manualOpenApiSpec: Swagger.Spec;
    let generatedOpenApiSpec: Swagger.Spec;

    beforeAll(async () => {
        manualOpenApiSpec = yamljs.load("src/modules/coreHttpApi/openapi.yml");

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
        generatedOpenApiSpec = await generator.getOpenApiSpec();
        generatedOpenApiSpec = (await swaggerParser.dereference(generatedOpenApiSpec as any)) as Swagger.Spec;
        manualOpenApiSpec = (await swaggerParser.dereference(manualOpenApiSpec as any)) as Swagger.Spec;
        harmonizeSpec(manualOpenApiSpec);
        harmonizeSpec(generatedOpenApiSpec);
    });
    test("all route names should match the generated ones", () => {
        const manualPaths = getPaths(manualOpenApiSpec);
        const generatedPaths = getPaths(generatedOpenApiSpec);

        generatedPaths.forEach((path) => {
            expect(manualPaths).toContain(path);
        });

        manualPaths.forEach((path) => {
            if (ignorePaths.includes(path)) {
                return;
            }

            expect(generatedPaths).toContain(path);
        });
    });
    test("all routes should have the same HTTP methods", () => {
        const manualPaths = getPaths(manualOpenApiSpec);
        // Paths to ignore in regard to return code consistency (Post requests that return 200 due to no creation)
        /* eslint-disable @typescript-eslint/naming-convention */
        const returnCodeOverwrite: Record<string, string | undefined> = {
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
                expectedResponseCode = returnCodeOverwrite[path] ?? expectedResponseCode;
                expect(manualResponses, `Path ${path} and method ${method} does not contain response code ${expectedResponseCode}`).toContainEqual(expectedResponseCode);
            });
        });
    });

    test("all generated params should be in the manual spec", () => {
        const pathsWithDBQueries = [
            { path: "/api/v2/Attributes/Own/Shared/Identity", method: "get" },
            { path: "/api/v2/Attributes/Peer/Shared/Identity", method: "get" },
            { path: "/api/v2/Attributes/Own/Shared/Identity", method: "get" }
        ];

        const generatedPaths = getPaths(generatedOpenApiSpec);
        generatedPaths.forEach((path) => {
            const generatedMethods = Object.keys(generatedOpenApiSpec.paths[path])
                .map((method) => method.toLowerCase())
                .sort() as (keyof Swagger.Path)[];
            generatedMethods.forEach((method: keyof Swagger.Path) => {
                const generatedOperation = generatedOpenApiSpec.paths[path][method];
                if (!isOperation(generatedOperation) || !generatedOperation.parameters) {
                    return;
                }

                const manualOperation = manualOpenApiSpec.paths[path][method];
                if (!isOperation(manualOperation) || !manualOperation.parameters) {
                    throw new Error(`${path} ${method} does not contain parameters but generated do`);
                }

                // DBQuery are used via context.query and not by injection as QueryParameter so they will not be generated and the length will be different
                if (!pathsWithDBQueries.some((p) => p.path === path && p.method.toLowerCase() === method.toLowerCase())) {
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(generatedOperation.parameters, `Parameter length for ${method.toUpperCase()} ${path} is wrong`).toHaveLength(manualOperation.parameters.length);
                }

                const manualPathParams = manualOperation.parameters.filter((param) => param.in === "path");
                const generatedPathParams = generatedOperation.parameters.filter((param) => param.in === "path");
                expect(generatedPathParams).toHaveLength(manualPathParams.length);

                generatedOperation.parameters
                    .filter((param) => param.in === "query")
                    .forEach((param) => {
                        const manualParameter = manualOperation.parameters!.find((manualParam) => manualParam.name === param.name);

                        expect(manualParameter, `${path} ${method} should contain param with name ${param.name}`).toBeDefined();

                        expect(param.name).toBe(manualParameter!.name);
                        expect(param.in).toBe(manualParameter!.in);
                        expect(param.required).toBe(manualParameter!.required);
                    });
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

// Paths not defined in the typescript-rest way
const ignorePaths = ["/health", "/Monitoring/Version", "/Monitoring/Requests", "/Monitoring/Support"];
function getPaths(spec: Swagger.Spec) {
    return Object.keys(spec.paths).filter((paths) => !ignorePaths.includes(paths));
}

function isOperation(obj: any): obj is Swagger.Operation {
    return obj.responses !== undefined;
}
