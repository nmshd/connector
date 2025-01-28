import express from "express";

export function csrfErrorHandler(err: any, _req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (err.code !== "EBADCSRFTOKEN") return next(err);
    res.status(403).json({ status: 403, message: "Missing or invalid CSRF token." });
}
