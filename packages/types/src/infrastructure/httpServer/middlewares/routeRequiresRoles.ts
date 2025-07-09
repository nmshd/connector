import { Errors } from "@nmshd/typescript-rest";
import express from "express";

export function routeRequiresRoles(...requiredRoles: [string, ...string[]]) {
    if (requiredRoles.length === 0) throw new Error("At least one role must be specified.");

    return (req: express.Request, _: express.Response, next: express.NextFunction): void => {
        const userRoles = req.userRoles;
        const hasRole = userRoles && Array.isArray(userRoles) && requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            next(new Errors.ForbiddenError("You are not allowed to access this endpoint."));
            return;
        }

        next();
    };
}
