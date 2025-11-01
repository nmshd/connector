import { Result } from "@js-soft/ts-utils";
import { Return } from "@nmshd/typescript-rest";
import express from "express";
import { QRCode } from "../../QRCode";
import { Envelope } from "./common/Envelope";
import { Mimetype } from "./common/Mimetype";

export abstract class BaseController {
    protected created<T>(result: Result<T>): Return.NewResource<Envelope<T>> {
        return new Return.NewResource<Envelope<T>>("_", this.json<T>(result));
    }

    protected ok<T>(result: Result<T>): Envelope<T> {
        return this.json<T>(result);
    }

    protected noContent<T>(result: Result<T>): void {
        this.guard<T>(result);
        return;
    }

    private json<T>(result: Result<T>): Envelope<T> {
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

    protected async qrCode<T extends Result<any>>(
        result: T,
        qrPredicate: (result: T) => Promise<QRCode>,
        filename: string,
        response: express.Response,
        status: number
    ): Promise<void> {
        this.guard(result);

        const mimetype = Mimetype.png();

        const qrCode = await qrPredicate(result);
        const buffer = Buffer.from(qrCode.asBase64(), "base64");

        response
            .status(status)
            .setHeader("content-type", mimetype.value)
            .setHeader("content-disposition", `attachment;filename=${encodeURIComponent(filename)}`)
            .send(buffer);
    }
}
