import { sleep } from "@js-soft/ts-utils";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import express, { Application, RequestHandler } from "express";
import helmet, { HelmetOptions } from "helmet";
import http from "http";
import { Server } from "typescript-rest";
import TypescriptRestIOC from "typescript-rest-ioc";
import { buildInformation } from "../../buildInformation";
import { ConnectorInfrastructure, InfrastructureConfiguration } from "../ConnectorInfastructure";
import { Envelope, HttpErrors } from "./common";
import { HttpMethod } from "./HttpMethod";
import { csrfErrorHandler } from "./middlewares/csrfErrorHandler";
import { genericErrorHandler, RouteNotFoundError } from "./middlewares/genericErrorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { setDurationHeader } from "./middlewares/setResponseDurationHeader";
import { setResponseTimeHeader } from "./middlewares/setResponseTimeHeader";
import { RequestTracker } from "./RequestTracker";

export interface CustomEndpoint {
    httpMethod: HttpMethod;
    route: string;
    authenticationRequired: boolean;
    handler: RequestHandler;
}

export interface MiddlewareConfig {
    route: string;
    authenticationRequired: boolean;
    handlers: RequestHandler[];
}

export interface ControllerConfig {
    globs: string[];
    baseDirectory: string;
}

export interface HttpServerConfiguration extends InfrastructureConfiguration {
    port?: number;
    apiKey: string;
    cors?: CorsOptions;
    helmetOptions?: HelmetOptions;
}

export class HttpServer extends ConnectorInfrastructure<HttpServerConfiguration> {
    private app: Application;
    private readonly customEndpoints: CustomEndpoint[] = [];
    private readonly controllers: ControllerConfig[] = [];
    private readonly middlewares: MiddlewareConfig[] = [];
    private server?: http.Server;

    private readonly requestTracker = new RequestTracker();

    public init(): void {
        this.app = express();
    }

    private configure(): void {
        this.logger.debug("Configuring middleware...");

        this.app.use(helmet(this.getHelmetOptions()));

        this.app.use(requestLogger(this.logger));
        this.app.use(this.requestTracker.getTrackingMiddleware());

        this.app.use(setDurationHeader);
        this.app.use(setResponseTimeHeader);

        if (this.configuration.cors) {
            this.app.use(cors(this.configuration.cors));
        }

        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json({ limit: "2mb" }));
        this.app.use(compression());

        this.useUnsecuredCustomMiddlewares();
        this.useUnsecuredCustomEndpoints();

        this.useHealthEndpoint();

        if (this.configuration.apiKey) {
            this.app.use(async (req, res, next) => {
                const apiKeyFromHeader = req.headers["x-api-key"];
                if (!apiKeyFromHeader || apiKeyFromHeader !== this.configuration.apiKey) {
                    await sleep(1000);
                    res.status(401).send(Envelope.error(HttpErrors.unauthorized(), this.connectorMode));
                    return;
                }

                next();
            });
        } else {
            this.logger.warn("No api key set in config, this Connector runs without any authentication! This is strongly discouraged.");
        }

        this.useVersionEndpoint();
        this.useResponsesEndpoint();
        this.useSupportEndpoint();

        this.useCustomControllers();
        this.useSecuredCustomMiddlewares();
        this.useSecuredCustomEndpoints();

        this.app.use(function (_req, _res, next) {
            next(new RouteNotFoundError());
        });

        this.useErrorHandlers();

        this.logger.debug("Completed configure()");
    }

    private getHelmetOptions(): HelmetOptions {
        if (this.configuration.helmetOptions) {
            return this.configuration.helmetOptions;
        }

        switch (this.connectorMode) {
            case "production":
                return {};
            case "debug":
                return {
                    // this csp is needed for the swagger ui / rapidoc
                    contentSecurityPolicy: {
                        directives: {
                            defaultSrc: [],
                            scriptSrc: ["'self'"],
                            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                            imgSrc: ["'self'", "https://enmeshed.eu", "data:"],
                            connectSrc: ["'self'"],
                            upgradeInsecureRequests: null
                        }
                    }
                };
        }
    }

    private useUnsecuredCustomEndpoints() {
        const securedCustomEndpoints = this.customEndpoints.filter((e) => !e.authenticationRequired);
        for (const endpoint of securedCustomEndpoints) {
            this.useCustomEndpoint(endpoint);
        }
    }

    private useSecuredCustomEndpoints() {
        const securedCustomEndpoints = this.customEndpoints.filter((e) => e.authenticationRequired);
        for (const endpoint of securedCustomEndpoints) {
            this.useCustomEndpoint(endpoint);
        }
    }

    private useCustomEndpoint(endpoint: CustomEndpoint) {
        switch (endpoint.httpMethod) {
            case HttpMethod.Get:
                this.app.get(endpoint.route, endpoint.handler);
                break;
            case HttpMethod.Post:
                this.app.post(endpoint.route, endpoint.handler);
                break;
            case HttpMethod.Put:
                this.app.put(endpoint.route, endpoint.handler);
                break;
            case HttpMethod.Delete:
                this.app.delete(endpoint.route, endpoint.handler);
                break;
        }
    }

    private useUnsecuredCustomMiddlewares() {
        const unsecuredCustomMiddlewares = this.middlewares.filter((e) => !e.authenticationRequired);
        for (const middleware of unsecuredCustomMiddlewares) {
            this.useCustomMiddleware(middleware);
        }
    }

    private useSecuredCustomMiddlewares() {
        const securedCustomMiddlewares = this.middlewares.filter((e) => e.authenticationRequired);
        for (const middleware of securedCustomMiddlewares) {
            this.useCustomMiddleware(middleware);
        }
    }

    private useCustomMiddleware(middleware: MiddlewareConfig) {
        this.app.use(middleware.route, middleware.handlers);
    }

    private useErrorHandlers() {
        this.app.use(csrfErrorHandler);
        this.app.use(genericErrorHandler(this.connectorMode));
    }

    private useHealthEndpoint() {
        this.app.get("/health", async (_req: any, res: any) => {
            const health = await this.runtime.getHealth();
            res.status(200).json(health);
        });
    }

    private useVersionEndpoint() {
        this.app.get("/Monitoring/Version", (_req: any, res: any) => {
            res.status(200).json(buildInformation);
        });
    }

    private useResponsesEndpoint() {
        this.app.get("/Monitoring/Requests", (_req: any, res: any) => {
            res.status(200).json(this.requestTracker.getCount());
        });
    }

    private useSupportEndpoint() {
        this.app.get("/Monitoring/Support", async (_req: any, res: any) => {
            const supportInformation = await this.runtime.getSupportInformation();
            res.status(200).json(supportInformation);
        });
    }

    private useCustomControllers() {
        Server.registerServiceFactory(TypescriptRestIOC);

        for (const controller of this.controllers) {
            Server.loadControllers(this.app, controller.globs, controller.baseDirectory);
        }

        Server.ignoreNextMiddlewares(true);
    }

    public async start(): Promise<void> {
        this.configure();
        return await new Promise((resolve) => {
            const port = this.configuration.port ?? 80;
            this.server = this.app.listen(port, () => {
                this.logger.info(`Listening on port ${port}`);
                resolve();
            });
        });
    }

    public stop(): void {
        this.server?.close();
    }

    public addEndpoint(httpMethod: HttpMethod, route: string, authenticationRequired: boolean, handler: RequestHandler): void {
        this.customEndpoints.push({ httpMethod, route, authenticationRequired, handler });
    }

    public addControllers(controllerGlobs: string[], baseDirectory: string): void {
        this.controllers.push({ globs: controllerGlobs, baseDirectory });
    }

    public addMiddleware(route: string, authenticationRequired: boolean, ...handlers: RequestHandler[]): void {
        this.middlewares.push({ route, authenticationRequired, handlers });
    }
}
