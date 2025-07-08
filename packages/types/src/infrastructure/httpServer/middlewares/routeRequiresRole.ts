import { Errors } from "@nmshd/typescript-rest";
import express from "express";

export function routeRequiresRole(role: string) {
    return (req: express.Request, _: express.Response, next: express.NextFunction): void => {
        if (!req.userRoles?.includes(role)) {
            throw new Errors.ForbiddenError("You are not allowed to access this endpoint.");
        }

        next();
    };
}
