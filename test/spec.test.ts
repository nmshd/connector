/* eslint-disable jest/no-conditional-in-test */
import swaggerParser from "@apidevtools/swagger-parser";
import { MetadataGenerator, SpecGenerator, Swagger } from "@nmshd/typescript-rest-swagger";
import { OpenAPIV3 } from "openapi-types";
import yamljs from "yamljs";

// eslint-disable-next-line jest/no-disabled-tests -- typescript-rest-swagger is not compatible with typescript 5.9 and we should not block ourselves with this test
describe.skip("test openapi spec against routes", () => {
    let manualOpenApiSpec: Swagger.Spec;
    let generatedOpenApiSpec: Swagger.Spec;

    beforeAll(async () => {
        manualOpenApiSpec = yamljs.load("src/modules/coreHttpApi/openapi.yml");

        const files = "src/modules/coreHttpApi/controllers/**/*.ts";
        const metadata = new MetadataGenerator([files], "tsconfig.json").generate();
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
        generatedOpenApiSpec = generator.getOpenApiSpec();
        generatedOpenApiSpec = (await swaggerParser.dereference(generatedOpenApiSpec as any)) as Swagger.Spec;
        manualOpenApiSpec = (await swaggerParser.dereference(manualOpenApiSpec as any)) as Swagger.Spec;
        harmonizeSpec(manualOpenApiSpec);
        harmonizeSpec(generatedOpenApiSpec);
    });

    test("all route names should match the generated ones", () => {
        const manualPaths = getPaths(manualOpenApiSpec);
        const generatedPaths = getPaths(generatedOpenApiSpec);

        generatedPaths.forEach((path) => {
            expect(manualPaths, "The route is programmed but not in the API spec").toContain(path);
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
        // Paths to ignore in regard to return code consistency (Post requests that return 200 due to no creation, deletes that return 204)
        /* eslint-disable @typescript-eslint/naming-convention */
        const returnCodeOverwrite: Record<string, Record<string, string> | undefined> = {
            "/api/core/v1/Account/Sync": { post: "204" },
            "/api/core/v1/Attributes/ExecuteIQLQuery": { post: "200" },
            "/api/core/v1/Attributes/ValidateIQLQuery": { post: "200" },
            "/api/core/v1/BackboneNotifications": { post: "204" },
            "/api/core/v1/Challenges/Validate": { post: "200" },
            "/api/core/v1/Relationships/{param}": { delete: "204" },
            "/api/core/v1/Attributes/{param}": { delete: "204" },
            "/api/core/v1/Files/{param}": { delete: "204" },
            "/api/core/v1/IdentityMetadata": { delete: "204" }
        };
        /* eslint-enable @typescript-eslint/naming-convention */

        manualPaths.forEach((path) => {
            if (ignorePaths.includes(path)) {
                return;
            }

            if (!generatedOpenApiSpec.paths?.[path]) {
                // This case would result in an error in the previous test
                return;
            }

            const generatedMethods = Object.keys(generatedOpenApiSpec.paths[path] ?? {})
                .map((method) => method.toLocaleLowerCase())
                .sort();
            const manualMethods = Object.keys(manualOpenApiSpec.paths?.[path] ?? {})
                .map((method) => method.toLocaleLowerCase())
                .sort();

            expect(generatedMethods, `Path ${path} do not have the same methods`).toStrictEqual(manualMethods);

            Object.keys(manualOpenApiSpec.paths?.[path] ?? {}).forEach((method) => {
                const key = method as "get" | "put" | "post" | "delete" | "options" | "head" | "patch";
                const manualResponses = Object.keys(manualOpenApiSpec.paths?.[path]?.[key]?.responses ?? {});
                let expectedResponseCode = key === "post" ? "201" : "200";
                expectedResponseCode = returnCodeOverwrite[path]?.[method] ?? expectedResponseCode;
                expect(manualResponses, `Path ${path} and method ${method} does not contain response code ${expectedResponseCode}`).toContainEqual(expectedResponseCode);
            });
        });
    });

    test("all generated params should be in the manual spec", () => {
        const pathsWithDBQueries = [
            { path: "/api/core/v1/Attributes/Own/Shared/{peer}", method: "get" },
            { path: "/api/core/v1/Attributes/Peer/Shared/{peer}", method: "get" },
            { path: "/api/core/v1/Attributes/Own/Identity", method: "get" }
        ];

        const generatedPaths = getPaths(generatedOpenApiSpec);
        generatedPaths.forEach((path) => {
            const generatedMethods = Object.keys(generatedOpenApiSpec.paths?.[path] ?? {})
                .map((method) => method.toLowerCase())
                .sort() as OpenAPIV3.HttpMethods[];
            generatedMethods.forEach((method: OpenAPIV3.HttpMethods) => {
                const generatedOperation = generatedOpenApiSpec.paths?.[path]?.[method];
                if (!isOperation(generatedOperation) || !generatedOperation.parameters || generatedOperation.parameters.length === 0) {
                    return;
                }

                const generatedParameters = generatedOperation.parameters as OpenAPIV3.ParameterObject[];
                if (!manualOpenApiSpec.paths?.[path]) {
                    // This case would result in an error in the previous test
                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                const manualOperation = manualOpenApiSpec.paths[path]?.[method];
                if (!isOperation(manualOperation) || !manualOperation.parameters) {
                    throw new Error(`${path} ${method} does not contain parameters but generated do`);
                }

                const manualParameters = manualOperation.parameters as OpenAPIV3.ParameterObject[];

                // DBQuery are used via context.query and not by injection as QueryParameter so they will not be generated and the length will be different
                if (!pathsWithDBQueries.some((p) => p.path === path && p.method.toLowerCase() === method.toLowerCase())) {
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(generatedParameters, `Parameter length for ${method.toUpperCase()} ${path} is wrong`).toHaveLength(manualParameters.length);
                }

                const manualPathParams = manualParameters.filter((param) => param.in === "path");
                const generatedPathParams = generatedParameters.filter((param) => param.in === "path");
                expect(generatedPathParams).toHaveLength(manualPathParams.length);

                generatedParameters
                    .filter((param) => param.in === "query")
                    .forEach((param) => {
                        const manualParameter = manualParameters.find((manualParam) => manualParam.name === param.name);

                        expect(manualParameter, `${path} ${method} should contain param with name ${param.name}`).toBeDefined();

                        expect(param.name).toBe(manualParameter!.name);
                        expect(param.in).toBe(manualParameter!.in);
                        expect(param.required).toBe(manualParameter!.required);
                    });

                const manualRequestBody = manualOperation.requestBody as OpenAPIV3.RequestBodyObject | undefined;
                const generatedRequestBody = generatedOperation.requestBody as OpenAPIV3.RequestBodyObject | undefined;
                expect(!!generatedRequestBody, `${path} ${method} request bodys do not match`).toBe(!!manualRequestBody);
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
    return Object.keys(spec.paths ?? {}).filter((paths) => !ignorePaths.includes(paths));
}

function isOperation(obj: any): obj is OpenAPIV3.OperationObject {
    return obj.responses !== undefined;
}
