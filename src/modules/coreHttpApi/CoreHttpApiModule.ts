import sea from "node:sea";
import path from "path";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import yamlJs from "yamljs";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";
import { HttpMethod } from "../../infrastructure";
import * as controllers from "./controllers";

export interface CoreHttpApiModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    docs: {
        enabled: boolean;
        rapidoc: {
            persistAuth: boolean;
        };
    };
}

export class CoreHttpApiModule extends ConnectorRuntimeModule<CoreHttpApiModuleConfiguration> {
    public get baseDirectory(): string {
        return __dirname;
    }

    public init(): void {
        if (this.configuration.docs.enabled) {
            switch (this.connectorMode) {
                case "production":
                    throw new Error("Documentation is not allowed in production mode.");
                case "debug":
                    this.addDocumentation();
                    break;
            }
        }

        console.log(Object.values(controllers));
        if (sea.isSea()) {
            console.log(Object.values(controllers));
            this.runtime.infrastructure.httpServer.addResolvedControllers(Object.values(controllers));
            return;
        }

        this.runtime.infrastructure.httpServer.addControllers(["controllers/*.js", "controllers/*.ts", "!controllers/*.d.ts"], this.baseDirectory);

        if (this.connectorMode === "debug") {
            this.runtime.infrastructure.httpServer.addControllers(["debug-controllers/*.js", "debug-controllers/*.ts", "!debug-controllers/*.d.ts"], this.baseDirectory);
        }
    }

    private addDocumentation() {
        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/api-docs*", false, (_req, res) => {
            res.redirect(301, "/docs/swagger");
        });

        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/docs", false, (_req, res) => {
            res.redirect(301, "/docs/swagger");
        });

        this.useOpenApi();
        this.useSwagger();
        this.useRapidoc();
        this.useFavicon();
    }

    private useRapidoc() {
        if (sea.isSea()) {
            this.logger.info("Rapidoc is not supported in SEA mode.");
            return;
        }

        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/rapidoc/rapidoc-min.js", false, (_req, res) => {
            res.sendFile(require.resolve("rapidoc"));
        });

        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/docs/rapidoc", false, (_req, res) => {
            res.send(`
                <!doctype html>
                    <head>
                        <title>Enmeshed Connector API</title>
                        <link rel="icon" href="/favicon.ico" />
                        <meta charset="utf-8">
                        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;600&amp;family=Roboto+Mono&amp;display=swap" rel="stylesheet">
                        <script type="module" src="/rapidoc/rapidoc-min.js"></script>
                    </head>
                    <body>
                        <rapi-doc
                            spec-url="/docs/json"
                            regular-font="Open Sans"
                            mono-font="Roboto Mono"
                            show-header="false"
                            bg-color="#2B303B"
                            text-color="#dee3ec"
                            theme="dark"
                            schema-description-expanded="true"
                            default-schema-tab="example"
                            persist-auth="${this.configuration.docs.rapidoc.persistAuth}"
                        > </rapi-doc>
                    </body>
                </html>
            `);
        });
    }

    private useFavicon() {
        if (sea.isSea()) {
            this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/favicon.ico", false, (_req, res) => {
                const favicon = sea.getAsset("favicon.ico");
                res.writeHead(200, [["Content-Type", "image/x-icon"]]);
                res.end(Buffer.from(favicon));
            });

            return;
        }

        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/favicon.ico", false, (_req, res) => {
            res.sendFile(path.join(this.baseDirectory, "static", "favicon.ico"));
        });
    }

    private useOpenApi() {
        const swaggerDocument = this.loadOpenApiSpec();

        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/docs/json", false, (_, res) => {
            res.send(swaggerDocument);
        });

        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/docs/yaml", false, (_, res) => {
            res.set("Content-Type", "text/vnd.yaml");
            res.send(yamlJs.stringify(swaggerDocument, 1000));
        });
    }

    private useSwagger() {
        if (sea.isSea()) {
            this.logger.info("Swagger is not supported in SEA mode.");
            return;
        }

        const swaggerUiOptions: SwaggerUiOptions = {
            explorer: true,
            customfavIcon: "/favicon.ico",
            customSiteTitle: "Enmeshed Connector API",
            customCss:
                ".swagger-ui .topbar {background-color: #29235c;}" +
                ".renderedMarkdown table th {border: 1px solid black; border-collapse: collapse}" +
                ".renderedMarkdown table td {border: 1px solid black; border-collapse: collapse}"
        };

        const spec = this.loadOpenApiSpec();

        this.runtime.infrastructure.httpServer.addMiddleware("/docs/swagger", false, ...swaggerUi.serve);
        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/docs/swagger", false, swaggerUi.setup(spec, swaggerUiOptions));
    }

    private loadOpenApiSpec() {
        if (sea.isSea()) {
            const content = sea.getAsset("openapi.yml", "utf-8");
            const swaggerDocument = yamlJs.parse(content);
            return swaggerDocument;
        }

        const swaggerDocument = yamlJs.load(path.join(this.baseDirectory, "openapi.yml"));
        return swaggerDocument;
    }

    public start(): void {
        // Nothing to do here
    }

    public stop(): void {
        // Nothing to do here
    }
}
