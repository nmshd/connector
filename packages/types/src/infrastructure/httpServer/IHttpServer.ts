import { RequestHandler } from "express";
import { ConnectorInfrastructure } from "../ConnectorInfrastructure";
import { HttpMethod } from "./HttpMethod";

export interface IHttpServer extends ConnectorInfrastructure {
    addEndpoint(httpMethod: HttpMethod, route: string, authenticationRequired: boolean, handler: RequestHandler): void;
    addControllers(controllerGlobs: string[], baseDirectory: string): void;
    addMiddleware(route: string, authenticationRequired: boolean, ...handlers: RequestHandler[]): void;
}
