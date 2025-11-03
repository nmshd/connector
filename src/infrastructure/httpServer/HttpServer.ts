import { ConnectorInfrastructure, HttpMethod, IHttpServer, InfrastructureConfiguration } from "@nmshd/connector-types";
import { Container } from "@nmshd/typescript-ioc";
import { Server, ServiceAuthenticator, routeRequiresAuthorization } from "@nmshd/typescript-rest";
import compression from "compression";
import correlator from "correlation-id";
import cors, { CorsOptions } from "cors";
import express, { Application, RequestHandler } from "express";
import { AuthOptions as BearerAuthOptions, auth as bearerAuth } from "express-oauth2-jwt-bearer";
import { ConfigParams as OauthParams, auth as openidAuth } from "express-openid-connect";
import helmet, { HelmetOptions } from "helmet";
import http from "http";
import { RequestTracker } from "./RequestTracker";
import {
    ApiKeyAuthenticationConfig,
    RouteNotFoundError,
    apiKeyAuth,
    csrfErrorHandler,
    enforceAuthentication,
    genericErrorHandler,
    isApiKeyAuthenticationEnabled,
    requestLogger,
    setDurationHeader,
    setResponseTimeHeader
} from "./middlewares";

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
    cors?: CorsOptions;
    helmetOptions?: HelmetOptions;
    authentication: {
        apiKey: ApiKeyAuthenticationConfig;
        oidc: { enabled?: boolean; rolesPath?: string } & OauthParams;
        jwtBearer: { enabled?: boolean } & BearerAuthOptions;
    };
}

export class HttpServer extends ConnectorInfrastructure<HttpServerConfiguration> implements IHttpServer {
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

        this.app.use((req, _, next) => {
            let correlationId = req.headers["x-correlation-id"];
            if (Array.isArray(correlationId)) {
                correlationId = correlationId[0];
            }
            if (correlationId) {
                correlator.withId(correlationId, next);
            } else {
                correlator.withId(next);
            }
        });

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
        this.useAuthentication();

        this.useVersionEndpoint();
        this.useRequestsEndpoint();
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

    get #authenticator(): ServiceAuthenticator {
        return { getRoles: (req) => req.userRoles ?? [] };
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
        const handlerWithAsyncErrorHandling: RequestHandler = async (req, res, next) => {
            try {
                await endpoint.handler(req, res, next);
            } catch (e) {
                next(e);
            }
        };

        const method = this.app[endpoint.httpMethod];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we need to check if the method is defined as it's possible to pass an invalid method when not using TypeScript
        if (!method) throw new Error(`Invalid HTTP method: ${endpoint.httpMethod}`);

        method.bind(this.app)(endpoint.route, handlerWithAsyncErrorHandling);
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
        this.app.use(middleware.route, ...middleware.handlers);
    }

    private useErrorHandlers() {
        this.app.use(csrfErrorHandler);
        this.app.use(genericErrorHandler(this.connectorMode, this.logger));
    }

    private useAuthentication() {
        const apiKeyAuthenticationEnabled = isApiKeyAuthenticationEnabled(this.configuration.authentication.apiKey);
        const oidcAuthenticationEnabled = this.configuration.authentication.oidc.enabled ?? Object.keys(this.configuration.authentication.oidc).length !== 0;
        const jwtBearerAuthenticationEnabled = this.configuration.authentication.jwtBearer.enabled ?? Object.keys(this.configuration.authentication.jwtBearer).length !== 0;
        if (!apiKeyAuthenticationEnabled && !oidcAuthenticationEnabled && !jwtBearerAuthenticationEnabled) {
            switch (this.connectorMode) {
                case "debug":
                    this.app.use((req: express.Request, _: express.Response, next: express.NextFunction) => {
                        req.userRoles = ["**"];

                        next();
                    });
                    return;
                case "production":
                    throw new Error(`No API key and OAuth config set in configuration. At least one is required in production mode.`);
            }
        }

        if (apiKeyAuthenticationEnabled) {
            this.app.use(apiKeyAuth(this.configuration.authentication.apiKey));
        }

        if (oidcAuthenticationEnabled) {
            const config = { ...this.configuration.authentication.oidc, authRequired: false };
            // remove the enabled and rolesPath properties as they are not supported by the express-openid-connect library
            delete config.enabled;
            delete config.rolesPath;

            this.app.use(openidAuth(config));
        }

        if (jwtBearerAuthenticationEnabled) {
            const config = { ...this.configuration.authentication.jwtBearer, authRequired: false };
            // remove the enabled property as it is not supported by the express-oauth2-jwt-bearer library
            delete config.enabled;

            this.app.use(bearerAuth(config));
        }

        this.app.use(
            enforceAuthentication(
                {
                    apiKey: {
                        enabled: apiKeyAuthenticationEnabled,
                        headerName: this.configuration.authentication.apiKey.headerName.toLocaleLowerCase()
                    },
                    jwtBearer: { enabled: jwtBearerAuthenticationEnabled },
                    oidc: { enabled: oidcAuthenticationEnabled, rolesPath: this.configuration.authentication.oidc.rolesPath },
                    connectorMode: this.connectorMode
                },
                this.logger
            )
        );
    }

    private useHealthEndpoint() {
        this.app.get("/health", async (_: express.Request, res: express.Response) => {
            const health = await this.runtime.getHealth();
            const httpStatus = health.isHealthy ? 200 : 500;
            res.status(httpStatus).json(health);
        });
    }

    private useVersionEndpoint() {
        this.app.get("/Monitoring/Version", routeRequiresAuthorization(this.#authenticator, "monitoring:version"), (_: express.Request, res: express.Response) => {
            const buildInformation = this.runtime.getBuildInformation();
            res.status(200).json(buildInformation);
        });
    }

    private useRequestsEndpoint() {
        this.app.get("/Monitoring/Requests", routeRequiresAuthorization(this.#authenticator, "monitoring:requests"), (_: express.Request, res: express.Response) => {
            res.status(200).json(this.requestTracker.getCount());
        });
    }

    private useSupportEndpoint() {
        this.app.get("/Monitoring/Support", routeRequiresAuthorization(this.#authenticator, "monitoring:support"), async (_: express.Request, res: express.Response) => {
            const supportInformation = await this.runtime.getSupportInformation();
            res.status(200).json(supportInformation);
        });
    }

    private useCustomControllers() {
        Server.registerServiceFactory({
            create: (serviceClass: any) => {
                return Container.get(serviceClass);
            },
            getTargetClass: (serviceClass: Function) => {
                let typeConstructor: any = serviceClass;
                if (typeConstructor["name"] && typeConstructor["name"] !== "ioc_wrapper") {
                    return typeConstructor as FunctionConstructor;
                }
                typeConstructor = typeConstructor["__parent"];
                while (typeConstructor) {
                    if (typeConstructor["name"] && typeConstructor["name"] !== "ioc_wrapper") {
                        return typeConstructor as FunctionConstructor;
                    }
                    typeConstructor = typeConstructor["__parent"];
                }

                this.logger.error("Can not identify the base Type for requested target: %o", serviceClass);
                throw new TypeError("Can not identify the base Type for requested target");
            }
        });

        Server.registerAuthenticator(this.#authenticator);

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
