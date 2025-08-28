import { ILogger } from "@js-soft/logging-abstractions";
import { sleep } from "@js-soft/ts-utils";
import { Envelope, HttpErrors } from "@nmshd/connector-types";
import express from "express";
import { RequestContext as OIDCRequestContext } from "express-openid-connect";

export function enforceAuthentication(
    config: {
        apiKey: { enabled: boolean; headerName: string };
        jwtBearer: { enabled: boolean };
        oidc: { enabled: boolean; rolesPath?: string };
        connectorMode: "debug" | "production";
    },
    logger: ILogger
): express.RequestHandler {
    const unauthorized = async (_: express.Request, res: express.Response) => {
        await sleep(1000 * (Math.floor(Math.random() * 4) + 1));
        res.status(401).send(Envelope.error(HttpErrors.unauthorized(), config.connectorMode));
    };

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const xApiKeyHeaderValue = req.headers[config.apiKey.headerName];
        const apiKeyFromHeader = Array.isArray(xApiKeyHeaderValue) ? xApiKeyHeaderValue[0] : xApiKeyHeaderValue;
        if (config.apiKey.enabled && apiKeyFromHeader) {
            const validationResult = req.apiKey!.validateApiKey(apiKeyFromHeader);
            if (!validationResult.isValid) return await unauthorized(req, res);

            const defaultApiKeyRoles = ["**"];
            req.userRoles = validationResult.scopes ?? defaultApiKeyRoles;

            next();
            return;
        }

        if (config.jwtBearer.enabled && req.headers["authorization"]) {
            // req.auth is set by the jwt-bearer middleware if the bearer token in the Authorization header is valid
            if (!req.auth) return await unauthorized(req, res);

            const scope = req.auth.payload.scope;

            if (typeof scope === "string") {
                req.userRoles = scope.split(" ");
            } else {
                logger.warn("JWT Bearer token does not contain a scope, using empty array as default.");
                req.userRoles = [];
            }

            next();
            return;
        }

        if (config.oidc.enabled) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we need to check if req.oidc is defined as there could be cases where the auth middleware is not applied
            if (!req.oidc) return next(new Error("req.oidc is not found, did you include the auth middleware?"));
            if (!req.oidc.isAuthenticated()) return await res.oidc.login();

            req.userRoles = extractRolesFromOIDC(logger, req.oidc, config.oidc.rolesPath);

            next();
            return;
        }

        await unauthorized(req, res);
    };
}

function extractRolesFromOIDC(logger: ILogger, context: OIDCRequestContext, rolesPath?: string): string[] {
    if (!context.user || !rolesPath) return [];

    const segments = rolesPath.split(".");
    if (segments.length === 0) return [];

    let current: any = context.user;
    const processedSegements = [];

    for (const segment of segments) {
        processedSegements.push(segment);
        if (!current[segment]) {
            logger.warn(`Roles path '${processedSegements.join(".")}' not found in OIDC user info, using empty array as default.`);
            return [];
        }

        current = current[segment];
    }

    if (!Array.isArray(current)) {
        logger.warn(`Roles path '${rolesPath}' does not point to an array in OIDC user info, using empty array as default.`);
        return [];
    }

    return current;
}
