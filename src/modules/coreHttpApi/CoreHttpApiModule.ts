import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";
import path from "path";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import yamlJs from "yamljs";

export interface CoreHttpApiModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    docs: { enabled: boolean; rapidoc: { persistAuth: boolean } };
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

        this.runtime.infrastructure.httpServer.addControllers(["controllers/*.js", "controllers/*.ts", "!controllers/*.d.ts"], this.baseDirectory);

        if (this.connectorMode === "debug") {
            this.runtime.infrastructure.httpServer.addControllers(["debug-controllers/*.js", "debug-controllers/*.ts", "!debug-controllers/*.d.ts"], this.baseDirectory);
        }
    }

    private addDocumentation() {
        this.runtime.infrastructure.httpServer.addEndpoint("get", "/api-docs*splat", false, (_req, res) => {
            res.redirect(301, "/docs/swagger");
        });

        this.runtime.infrastructure.httpServer.addEndpoint("get", "/docs", false, (_req, res) => {
            res.redirect(301, "/docs/swagger");
        });

        this.useOpenApi();
        this.useSwagger();
        this.useRapidoc();
        this.useFavicon();
    }

    private useRapidoc() {
        this.runtime.infrastructure.httpServer.addEndpoint("get", "/rapidoc/rapidoc-min.js", false, (_req, res) => {
            res.sendFile(require.resolve("rapidoc"));
        });

        this.runtime.infrastructure.httpServer.addEndpoint("get", "/docs/rapidoc", false, (_req, res) => {
            res.send(`
                <!doctype html>
                    <head>
                        <title>enmeshed Connector API</title>
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
        this.runtime.infrastructure.httpServer.addEndpoint("get", "/favicon.ico", false, (_req, res) => {
            res.sendFile(path.join(this.baseDirectory, "static", "favicon.ico"));
        });
    }

    private useOpenApi() {
        const swaggerDocument = this.loadOpenApiSpec();

        this.runtime.infrastructure.httpServer.addEndpoint("get", "/docs/json", false, (_, res) => {
            res.send(swaggerDocument);
        });

        this.runtime.infrastructure.httpServer.addEndpoint("get", "/docs/yaml", false, (_, res) => {
            res.set("Content-Type", "text/vnd.yaml");
            res.send(yamlJs.stringify(swaggerDocument, 1000));
        });
    }

    private useSwagger() {
        const swaggerUiOptions: SwaggerUiOptions = {
            explorer: true,
            customfavIcon: "/favicon.ico",
            customSiteTitle: "enmeshed Connector API",
            customCss:
                ".swagger-ui .topbar {background-color: #29235c;}" +
                ".renderedMarkdown table th {border: 1px solid black; border-collapse: collapse}" +
                ".renderedMarkdown table td {border: 1px solid black; border-collapse: collapse}"
        };

        const spec = this.loadOpenApiSpec();

        this.runtime.infrastructure.httpServer.addMiddleware("/docs/swagger", false, ...swaggerUi.serve);
        this.runtime.infrastructure.httpServer.addEndpoint("get", "/docs/swagger", false, swaggerUi.setup(spec, swaggerUiOptions));
    }

    private loadOpenApiSpec() {
        const swaggerDocument = yamlJs.load(path.join(this.baseDirectory, "openapi.yml"));
        return swaggerDocument;
    }

    public start(): void {
        // Nothing to do here
    }
}
