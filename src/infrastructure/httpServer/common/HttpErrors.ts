import { HttpError } from "./HttpError";

export class HttpErrors {
    public static unauthorized(): HttpError {
        return new HttpError("error.connector.unauthorized", "Unauthorized.");
    }

    public static invalidJsonInPayload(): HttpError {
        return new HttpError("error.connector.validation.invalidJsonInPayload", "The given payload is not a valid json object.");
    }

    public static routeDoesNotExist(): HttpError {
        return new HttpError("error.connector.http.routeDoesNotExist", "The requested route does not exist.");
    }

    public static methodNotAllowed(): HttpError {
        return new HttpError("error.connector.http.methodNotAllowed", "The request method is not supported for the requested resource.");
    }

    public static notAcceptable(): HttpError {
        return new HttpError(
            "error.connector.http.notAcceptable",
            "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request."
        );
    }
}
