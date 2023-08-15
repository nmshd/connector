import { DocumentationLink } from "../../../DocumentationLink";

export interface HttpErrorJSON {
    code: string;
    message: string;
    id: string;
    time: string;
    docs: string;
    stacktrace?: string[];
    details?: string;
}

export class HttpError {
    public readonly docs: string;
    public readonly id: string;
    public readonly time: string;

    public constructor(
        public readonly code: string,
        public readonly message: string,
        public readonly stacktrace?: string[],
        public readonly details?: string
    ) {
        this.id = HttpErrorId.create();
        this.time = new Date().toISOString();

        this.docs = DocumentationLink.integrate__errorCodes(code);
    }

    public toJSON(verbose?: "verbose"): HttpErrorJSON {
        const json: HttpErrorJSON = {
            code: this.code,
            message: this.message,
            id: this.id,
            time: this.time,
            docs: this.docs
        };

        if (verbose) {
            json.stacktrace = this.stacktrace;
            json.details = this.details;
        }

        return json;
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
