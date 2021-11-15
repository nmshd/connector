import { NextFunction, Request, Response } from "express";
import onHeaders from "on-headers";

export function setResponseTimeHeader(req: Request, res: Response, next: NextFunction): void {
    onHeaders(res, function onHeaders() {
        res.setHeader("X-Response-Time", new Date().toISOString());
    });

    next();
}
