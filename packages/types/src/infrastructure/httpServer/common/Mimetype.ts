export class Mimetype {
    public constructor(public value: string) {}

    public static png(): Mimetype {
        return new Mimetype("image/png");
    }

    public static jpeg(): Mimetype {
        return new Mimetype("image/png");
    }

    public static json(): Mimetype {
        return new Mimetype("application/json");
    }

    public static pdf(): Mimetype {
        return new Mimetype("application/pdf");
    }
}
