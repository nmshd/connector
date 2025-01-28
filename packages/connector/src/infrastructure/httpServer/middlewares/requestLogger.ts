import { ILogger } from "@js-soft/logging-abstractions";
import { NextFunction, Request, Response } from "express";

export function requestLogger(logger: ILogger) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const startAt = process.hrtime();
        res.on("finish", function () {
            const diff = process.hrtime(startAt)[1];
            const time = Math.round(diff / 1_000_000);
            logger.info(`${req.method} ${req.path} ${res.statusCode} -- ${time}ms`);
        });
        next();
    };
}
