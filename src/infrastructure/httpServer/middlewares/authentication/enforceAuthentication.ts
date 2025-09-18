import { ILogger } from "@js-soft/logging-abstractions";
import { sleep } from "@js-soft/ts-utils";
import { Envelope, HttpErrors } from "@nmshd/connector-types";
import { CoreDate } from "@nmshd/core-types";
import express from "express";
import { RequestContext as OIDCRequestContext } from "express-openid-connect";
import { jwtDecode } from "jwt-decode";

export function enforceAuthentication(
    config: {
        apiKey: { enabled: boolean; headerName: string };
        jwtBearer: { enabled: boolean };
        oidc: { enabled: boolean; rolesPath?: string };
        connectorMode: "debug" | "production";
    },
    logger: ILogger
): express.RequestHandler {
    const unauthorized = async (res: express.Response) => {
        await sleep(1000 * (Math.floor(Math.random() * 4) + 1));
        res.status(401).send(Envelope.error(HttpErrors.unauthorized(), config.connectorMode));
    };

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const xApiKeyHeaderValue = req.headers[config.apiKey.headerName];
        const apiKeyFromHeader = Array.isArray(xApiKeyHeaderValue) ? xApiKeyHeaderValue[0] : xApiKeyHeaderValue;
        if (config.apiKey.enabled && apiKeyFromHeader) {
            const validationResult = req.apiKey!.validateApiKey(apiKeyFromHeader);
            if (!validationResult.isValid) return await unauthorized(res);

            const defaultApiKeyRoles = ["**"];
            req.userRoles = validationResult.scopes ?? defaultApiKeyRoles;

            next();
            return;
        }

        if (config.jwtBearer.enabled && req.headers["authorization"]) {
            // req.auth is set by the jwt-bearer middleware if the bearer token in the Authorization header is valid
            if (!req.auth) return await unauthorized(res);

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
            const oidcContext = req.oidc;

            const rejectRequest = async (req: express.Request, res: express.Response) => {
                if (req.xhr || (!req.accepts("html") && req.accepts("json"))) return await unauthorized(res);

                return await res.oidc.login();
            };

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we need to check if req.oidc is defined as there could be cases where the auth middleware is not applied
            if (!oidcContext) return next(new Error("req.oidc is not found, did you include the auth middleware?"));

            if (!oidcContext.isAuthenticated()) return await rejectRequest(req, res);

            if (oidcContext.accessToken?.isExpired()) {
                const refreshToken = oidcContext.refreshToken;
                if (!refreshToken) return await rejectRequest(req, res);

                const decodedRefreshToken = jwtDecode(refreshToken);

                if (CoreDate.from((decodedRefreshToken.exp ?? 0) * 1000).isExpired()) {
                    return await rejectRequest(req, res);
                }

                await req.oidc.accessToken?.refresh();
            }

            req.userRoles = extractRolesFromOIDC(logger, oidcContext, config.oidc.rolesPath);

            next();
            return;
        }

        await unauthorized(res);
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
