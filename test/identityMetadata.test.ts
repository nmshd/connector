import { Random, RandomCharacterRange } from "@nmshd/transport";
import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClientWithMetadata;

beforeAll(async () => {
    [client1] = await launcher.launch(1);
}, 30000);

afterAll(() => launcher.stop());

describe("IdentityMetadata", () => {
    test.each([
        {
            reference: "did:e:localhost:dids:1234567890abcdef123456",
            key: undefined,
            value: "value"
        },
        {
            reference: "did:e:localhost:dids:1234567890abcdef123456",
            key: undefined,
            value: { a: "json" }
        },
        {
            reference: "did:e:localhost:dids:1234567890abcdef123456",
            key: "key",
            value: "value"
        }
    ])("should upsert an IdentityMetadata with key '$key' and value '$value'", async (data) => {
        const result = await client1.identityMetadata.upsertIdentityMetadata(data);
        expect(result).toBeSuccessful(ValidationSchema.IdentityMetadata);

        const identityMetadata = result.result;
        expect(identityMetadata.value).toStrictEqual(data.value);
    });

    test("should get an IdentityMetadata", async () => {
        const reference = await generateReference();
        await client1.identityMetadata.upsertIdentityMetadata({ reference: reference, value: "value" });

        const result = await client1.identityMetadata.getIdentityMetadata(reference);
        expect(result).toBeSuccessful(ValidationSchema.IdentityMetadata);

        const identityMetadata = result.result;
        expect(identityMetadata.value).toBe("value");
    });

    test("should delete an IdentityMetadata", async () => {
        const reference = await generateReference();
        await client1.identityMetadata.upsertIdentityMetadata({ reference: reference, value: "value" });

        const result = await client1.identityMetadata.deleteIdentityMetadata(reference);
        expect(result).toBeSuccessfulVoidResult();

        const getResult = await client1.identityMetadata.getIdentityMetadata(reference);
        expect(getResult).toBeAnError("IdentityMetadata not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });
});

async function generateReference(): Promise<string> {
    const identityPart = await Random.string(22, `${RandomCharacterRange.Digit}abcdef`);
    return `did:e:localhost:dids:${identityPart}`;
}
