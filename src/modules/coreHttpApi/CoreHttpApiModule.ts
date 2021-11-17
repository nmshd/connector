import path from "path";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import { SwaggerOptions } from "typescript-rest";
import YAML from "yamljs";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";
import { HttpMethod } from "../../infrastructure";

export interface CoreHttpApiModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    docs: {
        enabled: boolean;
    };
}

export default class CoreHttpApiModule extends ConnectorRuntimeModule<CoreHttpApiModuleConfiguration> {
    public init(): void {
        if (this.configuration.docs.enabled) {
            this.addDocumentation();
        }

        this.runtime.httpServer.addControllers(["controllers/*.js", "controllers/*.ts", "!controllers/*.d.ts"], this.baseDirectory);
    }

    private addDocumentation() {
        this.runtime.httpServer.addEndpoint(HttpMethod.Get, "/api-docs*", false, (_req, res) => {
            res.redirect(301, "/docs/swagger/");
        });

        this.runtime.httpServer.addEndpoint(HttpMethod.Get, "/docs", false, (_req, res) => {
            res.redirect(301, "/docs/swagger/");
        });

        this.useOpenApi();
        this.useSwagger({
            endpoint: "docs/swagger/",
            swaggerUiOptions: {
                customfavIcon: "https://enmeshed.eu/favicon.ico",
                customSiteTitle: "Business Connector API",
                customCss:
                    ".swagger-ui .topbar {background-color: #29235c;}" +
                    ".renderedMarkdown table th {border: 1px solid black; border-collapse: collapse}" +
                    ".renderedMarkdown table td {border: 1px solid black; border-collapse: collapse}"
            },
            filePath: path.resolve(__dirname, "./openapi.yml")
        });

        this.useRapidoc();
        this.useFavicon();
    }

    private useRapidoc() {
        this.runtime.httpServer.addEndpoint(HttpMethod.Get, "/rapidoc/rapidoc-min.js", false, (_req, res) => {
            res.sendFile(require.resolve("rapidoc"));
        });

            res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval' 'unsafe-inline'");

            res.send(`
                <!doctype html>
                    <head>
                        <title>Business Connector API</title>
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
                        > </rapi-doc>
                    </body>
                </html>
            `);
        });
    }

    private useFavicon() {
        this.runtime.infrastructure.httpServer.addEndpoint(HttpMethod.Get, "/favicon.ico", false, (_req, res) => {
            res.sendFile(path.join(this.baseDirectory, "static", "favicon.ico"));
        });
    }

    private useOpenApi() {
        const swaggerDocument = this.loadOpenApiSpec();

        this.runtime.httpServer.addEndpoint(HttpMethod.Get, "/docs/json", false, (req, res) => {
            res.send(swaggerDocument);
        });

        this.runtime.httpServer.addEndpoint(HttpMethod.Get, "/docs/yaml", false, (req, res) => {
            res.set("Content-Type", "text/vnd.yaml");
            res.send(YAML.stringify(swaggerDocument, 1000));
        });
    }

    private useSwagger(options: SwaggerOptions) {
        const spec = this.loadOpenApiSpec();

        const swaggerUiOptions: SwaggerUiOptions = {
            explorer: true,
            customfavIcon: "/favicon.ico",
        };

        const handlers = swaggerUi.serve;
        handlers.push(swaggerUi.setup(spec, swaggerUiOptions));

        this.runtime.httpServer.addMiddleware(path.posix.join("/", options.endpoint!), false, ...handlers);
    }

    private loadOpenApiSpec() {
        const swaggerDocument = YAML.load(path.join(this.baseDirectory, "openapi.yml"));
        return swaggerDocument;
    }

    public start(): void {
        // Nothing to do here
    }

    public stop(): void {
        // Nothing to do here
    }
}
