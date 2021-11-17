import { DocumentationLinkBuilder } from "../../../DocumentationLinkBuilder";

export class HttpError {
    public readonly code: string;
    public readonly message: string;
    public readonly docs: string;
    public readonly id: string;
    public readonly time: string;

    public constructor(code: string, message: string) {
        this.id = HttpErrorId.create();
        this.time = new Date().toISOString();
        this.code = code;
        this.message = message;

        const docLinkBuilder = new DocumentationLinkBuilder();
        this.docs = docLinkBuilder.integrate().errorCodes().build(code);
    }

    public static forDev(code: string, message: string, stacktrace: string[], details: string): HttpErrorDev {
        return new HttpErrorDev(code, message, stacktrace, details);
    }

    public static forProd(code: string, message: string): HttpError {
        return new HttpError(code, message);
    }
}

export class HttpErrorDev extends HttpError {
    public constructor(code: string, message: string, public readonly stacktrace: string[], public readonly details: string) {
        super(code, message);
    }
}

export class HttpErrorId {
    private static readonly prefix = "ERR";
    private static readonly totalLength = 20;
    private static readonly lengthOfRandomPart = HttpErrorId.totalLength - HttpErrorId.prefix.length;
    private static readonly characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static readonly charactersLength = HttpErrorId.characters.length;

    public static create(): string {
        let result = HttpErrorId.prefix;
        for (let i = 0; i < HttpErrorId.lengthOfRandomPart; i++) {
            result += HttpErrorId.characters.charAt(Math.floor(Math.random() * HttpErrorId.charactersLength));
        }
        return result;
    }
}
