import { ApplicationError } from "@js-soft/ts-utils";
import { RuntimeErrors } from "@nmshd/runtime";
import { CoreErrors as TransportCoreErrors, RequestError } from "@nmshd/transport";
import express from "express";
import stringify from "json-stringify-safe";
import { Errors } from "typescript-rest";
import { ConnectorMode } from "../../../ConnectorMode";
import { ConnectorLoggerFactory } from "../../../logging/ConnectorLoggerFactory";
import { Envelope, HttpError, HttpErrors } from "../common";

export class RouteNotFoundError extends Error {}

export function genericErrorHandler(connectorMode: ConnectorMode) {
    return (error: any, _req: express.Request, res: express.Response, next: express.NextFunction): void => {
        const logger = ConnectorLoggerFactory.getLogger(genericErrorHandler);

        try {
            if (res.headersSent) {
                logger.debug("Headers already sent. Calling next(error)...");
                return next(error); // Delegate to default error handler to abort stream processing
            }

            if (error instanceof SyntaxError) {
                logger.debug(`Handling ${SyntaxError.name}...`);

                const payload = Envelope.error(HttpErrors.invalidJsonInPayload(), connectorMode);

                res.status(400).json(payload);

                return;
            }

            if (error instanceof RouteNotFoundError) {
                logger.debug(`Handling ${RouteNotFoundError.name}...`);

                const payload = Envelope.error(HttpErrors.routeDoesNotExist(), connectorMode);
                res.status(404).json(payload);
                return;
            }

            if (error instanceof Errors.MethodNotAllowedError) {
                logger.debug(`Handling ${Errors.MethodNotAllowedError.name}...`);

                const payload = Envelope.error(HttpErrors.methodNotAllowed(), connectorMode);
                res.status(405).json(payload);
                return;
            }

            if (error instanceof Errors.NotAcceptableError) {
                logger.debug(`Handling ${Errors.NotAcceptableError.name}...`);

                const payload = Envelope.error(HttpErrors.notAcceptable(), connectorMode);
                res.status(406).json(payload);
                return;
            }

            if (error instanceof ApplicationError) {
                logger.debug(`Handling ${ApplicationError.name}...`);

                const payload = Envelope.error(new HttpError(error.code, error.message, error.stack?.split("\n")), connectorMode);

                let statusCode;
                if (error.equals(RuntimeErrors.general.recordNotFound()) || error.equals(TransportCoreErrors.general.recordNotFound("", ""))) {
                    statusCode = 404;
                } else {
                    statusCode = 400;
                }

                res.status(statusCode).json(payload);
                return;
            }

            const stacktrace = stackTraceFromError(error);

            let details: string;
            if (error.message) {
                details = error.message;
            } else {
                details = stringify(error);
            }

            if (error instanceof RequestError) {
                logger.debug(`Handling ${RequestError.name}...`);

                const httpError = new HttpError(error.code, error.reason, stacktrace, details);

                logger.error(`${httpError.id}\n${error.stack}`, error.object);

                const payload = Envelope.error(httpError, connectorMode);

                // Sanitize the status (prevent express errors)
                res.status(sanitizeStatus(error.status)).json(payload);
                return;
            }

            // Unknown => 500
            const httpError = new HttpError("error.connector.unexpected", "An unexpected error occurred.", stacktrace, details);

            logger.error(`${httpError.id}\n${error.stack}`);

            const payload = Envelope.error(httpError, connectorMode);

            res.status(500).json(payload);
        } catch (error: any) {
            const httpError = new HttpError(
                "error.connector.errorInErrorHandler",
                `The error handler ran into an error, caused by '${error.message}', this should not happen`,
                stackTraceFromError(error),
                "Report this to a connector developer"
            );

            logger.fatal(httpError);

            res.status(500).json(Envelope.error(httpError, connectorMode));
        }
    };
}

function sanitizeStatus(status: any): number {
    if (typeof status !== "number") {
        return 500;
    }

    if (status < 100 || status > 599) {
        return 500;
    }

    return status;
}

function stackTraceFromError(error: any) {
    if (error.stack) {
        return error.stack.split("\n");
    }
    return ["<There is no stacktrace>"];
}
