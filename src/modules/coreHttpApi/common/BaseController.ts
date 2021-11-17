import { Result } from "@js-soft/ts-utils";
import express from "express";
import { Return } from "typescript-rest";
import { Envelope } from "../../../infrastructure";

export abstract class BaseController {
    protected created<T>(result: Result<T>): Return.NewResource<Envelope> {
        return new Return.NewResource<Envelope>("_", this.json<T>(result));
    }

    protected ok<T>(result: Result<T>): Envelope {
        return this.json(result);
    }

    protected noContent<T>(result: Result<T>): void {
        this.guard(result);
        return;
    }

    private json<T>(result: Result<T>): Envelope {
        this.guard(result);
        return Envelope.ok(result.value);
    }

    private guard<T>(result: Result<T>) {
        if (result.isError) {
            throw result.error;
        }
    }

    protected file<T extends Result<any>>(
        result: T,
        contentPredicate: (result: T) => Buffer | string | Uint8Array | undefined,
        filenamePredicate: (result: T) => string,
        mimetypePredicate: (result: T) => Mimetype,
        response: express.Response,
        status: number
    ): void {
        this.guard(result);

        const content = contentPredicate(result);
        const filename = filenamePredicate(result);
        const mimetype = mimetypePredicate(result);

        if (!content || content.length <= 0) {
            throw new Error("'content' cannot be empty or undefined");
        }

        let buffer: Buffer;
        if (content instanceof Buffer) {
            buffer = content;
        } else if (content instanceof Uint8Array) {
            buffer = Buffer.from(content);
        } else {
            buffer = Buffer.from(content, "base64");
        }

        response.status(status).setHeader("content-type", mimetype.value).setHeader("content-disposition", `attachment;filename=${filename}`).send(buffer);
    }
}

export class Mimetype {
    public constructor(public value: string) {}

    public static png(): Mimetype {
        return new Mimetype("image/png");
    }
}
