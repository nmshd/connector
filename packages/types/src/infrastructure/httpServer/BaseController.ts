import { Result } from "@js-soft/ts-utils";
import { Return } from "@nmshd/typescript-rest";
import express from "express";
import * as qrcodeLibrary from "qrcode";
import { Envelope } from "./common/Envelope";
import { Mimetype } from "./common/Mimetype";

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

        if (!content) throw new Error("'content' cannot be undefined");

        let buffer: Buffer;
        if (content instanceof Buffer) {
            buffer = content;
        } else if (content instanceof Uint8Array) {
            buffer = Buffer.from(content);
        } else {
            buffer = Buffer.from(content, "base64");
        }

        response
            .status(status)
            .setHeader("content-type", mimetype.value)
            .setHeader("content-disposition", `attachment;filename=${encodeURIComponent(filename)}`)
            .send(buffer);
    }

    protected async qrCode<T extends Result<{ reference: { url: string } }>>(result: T, filename: string, response: express.Response, status: number): Promise<void> {
        this.guard(result);

        const mimetype = Mimetype.png();

        const reference = result.value.reference.url;
        const dataUrl = await qrcodeLibrary.toDataURL(reference);
        const base64 = dataUrl.split(",")[1];
        const buffer = Buffer.from(base64, "base64");

        response
            .status(status)
            .setHeader("content-type", mimetype.value)
            .setHeader("content-disposition", `attachment;filename=${encodeURIComponent(filename)}`)
            .send(buffer);
    }
}
