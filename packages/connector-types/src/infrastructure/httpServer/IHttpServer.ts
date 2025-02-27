import { RequestHandler } from "express";
import { IConnectorInfrastructure } from "../ConnectorInfrastructure";
import { HttpMethod } from "./HttpMethod";

export interface IHttpServer extends IConnectorInfrastructure {
    start(): Promise<void>;
    stop(): void;
    addEndpoint(httpMethod: HttpMethod, route: string, authenticationRequired: boolean, handler: RequestHandler): void;
    addControllers(controllerGlobs: string[], baseDirectory: string): void;
    addMiddleware(route: string, authenticationRequired: boolean, ...handlers: RequestHandler[]): void;
}
