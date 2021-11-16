import { NextFunction, Request, Response } from "express";
import onHeaders from "on-headers";

export function setDurationHeader(req: Request, res: Response, next: NextFunction): void {
    const startAt = process.hrtime();

    onHeaders(res, function onHeaders() {
        const diff = process.hrtime(startAt)[1];
        const time = Math.round(diff / 1000000);

        res.setHeader("X-Response-Duration-ms", time);
    });

    next();
}
