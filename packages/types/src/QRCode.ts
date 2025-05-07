import * as qrcodeLibrary from "qrcode";

export class QRCode {
    private constructor(private readonly base64: string) {}

    public asBase64(): string {
        return this.base64;
    }

    public static async for(reference: string): Promise<QRCode> {
        const dataUrl = await qrcodeLibrary.toDataURL(reference.startsWith("http") ? reference : `nmshd://tr#${reference}`);
        const base64 = dataUrl.split(",")[1];

        return new QRCode(base64);
    }
}
