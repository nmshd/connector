import { sleep } from "@js-soft/ts-utils";
import { ConnectorInfrastructure, Envelope, HttpErrors, HttpMethod, IHttpServer, InfrastructureConfiguration } from "@nmshd/connector-types";
import { CoreDate } from "@nmshd/core-types";
import { Container } from "@nmshd/typescript-ioc";
import { Server } from "@nmshd/typescript-rest";
import compression from "compression";
import correlator from "correlation-id";
import cors, { CorsOptions } from "cors";
import express, { Application, RequestHandler } from "express";
import { AuthOptions as BearerAuthOptions, auth as bearerAuth } from "express-oauth2-jwt-bearer";
import { ConfigParams as OauthParams, auth as openidAuth } from "express-openid-connect";
import helmet, { HelmetOptions } from "helmet";
import http from "http";
import { buildInformation } from "../../buildInformation";
import { RequestTracker } from "./RequestTracker";
import { csrfErrorHandler } from "./middlewares/csrfErrorHandler";
import { RouteNotFoundError, genericErrorHandler } from "./middlewares/genericErrorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { setDurationHeader } from "./middlewares/setResponseDurationHeader";
import { setResponseTimeHeader } from "./middlewares/setResponseTimeHeader";

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
        apiKey:
            | { enabled: false }
            | {
                  enabled: true;
                  headerName?: string;
                  keys: Record<string, { enabled?: boolean; key: string; description?: string; expiresAt?: string }>;
              };
        oidc: { enabled: false } | (OauthParams & { enabled: true });
        jwtBearer: { enabled: false } | (BearerAuthOptions & { enabled: true });
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
        this.applyAuthentication();

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
        this.app.use(middleware.route, middleware.handlers);
    }

    private useErrorHandlers() {
        this.app.use(csrfErrorHandler);
        this.app.use(genericErrorHandler(this.connectorMode, this.logger));
    }

    private applyAuthentication() {
        const apiKeyAuthenticationEnabled = this.configuration.authentication.apiKey.enabled;
        const oidcAuthenticationEnabled = this.configuration.authentication.oidc.enabled;
        const jwtBearerAuthenticationEnabled = this.configuration.authentication.jwtBearer.enabled;
        if (!apiKeyAuthenticationEnabled && !oidcAuthenticationEnabled && !jwtBearerAuthenticationEnabled) {
            switch (this.connectorMode) {
                case "debug":
                    return;
                case "production":
                    throw new Error(`No API key and OAuth config set in configuration. At least one is required in production mode.`);
            }
        }

        const apiKeys = this.getValidApiKeys();

        if (oidcAuthenticationEnabled) {
            this.app.use(openidAuth({ ...this.configuration.authentication.oidc, authRequired: false }));
        }

        if (jwtBearerAuthenticationEnabled) {
            this.app.use(bearerAuth({ ...this.configuration.authentication.jwtBearer, authRequired: false }));
        }

        const unauthorized = async (_: express.Request, res: express.Response) => {
            await sleep(1000 * (Math.floor(Math.random() * 4) + 1));
            res.status(401).send(Envelope.error(HttpErrors.unauthorized(), this.connectorMode));
        };

        const isApiKeyValid = (apiKey: string): boolean => {
            if (!apiKeys) return false;

            return apiKeys.some((keyDefinition) => keyDefinition.apiKey === apiKey && !(keyDefinition.expiresAt?.isExpired() ?? false));
        };

        this.app.use(async (req, res, next) => {
            const xApiKeyHeaderValue = req.headers["x-api-key"];
            const apiKeyFromHeader = Array.isArray(xApiKeyHeaderValue) ? xApiKeyHeaderValue[0] : xApiKeyHeaderValue;
            if (apiKeyAuthenticationEnabled && apiKeyFromHeader && apiKeys) {
                if (!isApiKeyValid(apiKeyFromHeader)) return await unauthorized(req, res);

                next();
                return;
            }

            if (this.configuration.authentication.jwtBearer && req.headers["authorization"]) {
                if (!req.auth) return await unauthorized(req, res);

                next();
                return;
            }

            if (oidcAuthenticationEnabled) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we need to check if req.oidc is defined as there could be cases where the auth middleware is not applied
                if (!req.oidc) return next(new Error("req.oidc is not found, did you include the auth middleware?"));
                if (!req.oidc.isAuthenticated()) return await res.oidc.login();

                next();
                return;
            }

            await unauthorized(req, res);
        });
    }

    private getValidApiKeys(): { apiKey: string; expiresAt?: CoreDate }[] | undefined {
        if (!this.configuration.authentication.apiKey.enabled) return;

        const apiKeys = Object.values(this.configuration.authentication.apiKey.keys);

        const apiKeyPolicy = /^(?=.*[A-Z].*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z]).{30,}$/;

        const enabledAndNotExpiredApiKeys = apiKeys
            .filter((apiKey) => apiKey.enabled !== false)
            .filter((apiKey) => apiKey.expiresAt === undefined || !CoreDate.from(apiKey.expiresAt).isExpired());

        const notMatchingApiKeys = enabledAndNotExpiredApiKeys.filter((apiKey) => !apiKey.key.match(apiKeyPolicy));
        if (notMatchingApiKeys.length !== 0) {
            throw new Error(
                `${notMatchingApiKeys.length} API keys do not meet the requirements. They must be at least 30 characters long and contain at least 2 digits, 2 uppercase letters, 2 lowercase letters and 1 special character (!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~).`
            );
        }

        return enabledAndNotExpiredApiKeys.map((apiKey) => ({
            apiKey: apiKey.key,
            expiresAt: apiKey.expiresAt ? CoreDate.from(apiKey.expiresAt) : undefined
        }));
    }

    private useHealthEndpoint() {
        this.app.get("/health", async (_req: any, res: any) => {
            const health = await this.runtime.getHealth();
            const httpStatus = health.isHealthy ? 200 : 500;
            res.status(httpStatus).json(health);
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
