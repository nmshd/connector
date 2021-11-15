import { NextFunction, Request, Response } from "express";

export interface RequestCount {
    since: string;
    requestCount: number;
    requestCountByStatus: Record<string, number>;
}

export class RequestTracker {
    private readonly requestCount: RequestCount = {
        since: new Date().toISOString(),
        requestCount: 0,
        requestCountByStatus: {}
    };

    public getTrackingMiddleware() {
        return (_req: Request, res: Response, next: NextFunction): void => {
            res.on("finish", () => this.countRequest(res.statusCode));
            next();
        };
    }

    private countRequest(code: number) {
        this.requestCount.requestCount++;
        this.requestCount.requestCountByStatus[code] = ++this.requestCount.requestCountByStatus[code] || 1;
    }

    public getCount(): RequestCount {
        return this.requestCount;
    }
}
