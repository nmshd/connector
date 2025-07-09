import { Errors } from "@nmshd/typescript-rest";
import express from "express";

export function routeRequiresRoles(...roles: [string, ...string[]]) {
    if (roles.length === 0) throw new Error("At least one role must be specified.");

    return (req: express.Request, _: express.Response, next: express.NextFunction): void => {
        const userRoles = req.userRoles;
        const hasRole = userRoles && Array.isArray(userRoles) && roles.some((role) => userRoles.includes(role));
        if (!hasRole) throw new Errors.ForbiddenError("You are not allowed to access this endpoint.");

        next();
    };
}
