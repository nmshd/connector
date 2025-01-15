import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClientWithMetadata;
let client1Address: string;

beforeAll(async () => {
    [client1] = await launcher.launch(1);
    client1Address = (await client1.account.getIdentityInfo()).result.address;
}, 30000);

afterAll(() => launcher.stop());

describe("IdentityMetadata", () => {
    test.each([
        {
            reference: client1Address,
            key: undefined,
            value: "value"
        },
        {
            reference: client1Address,
            key: undefined,
            value: { a: "json" }
        },
        {
            reference: client1Address,
            key: "key",
            value: "value"
        }
    ])("should upsert an IdentityMetadata with key '$key' and value '$value'", async (data) => {
        const result = await client1.identityMetadata.upsertIdentityMetadata(data);
        expect(result).toBeSuccessful(ValidationSchema.IdentityMetadata);

        const identityMetadata = result.result;
        expect(identityMetadata.reference.toString()).toStrictEqual(data.reference);
        expect(identityMetadata.key).toStrictEqual(data.key);
        expect(identityMetadata.value).toStrictEqual(data.value);
    });

    test("should get an IdentityMetadata", async () => {
        await client1.identityMetadata.upsertIdentityMetadata({ reference: client1Address, value: "value" });

        const result = await client1.identityMetadata.getIdentityMetadata(client1Address);
        expect(result).toBeSuccessful(ValidationSchema.IdentityMetadata);

        const identityMetadata = result.result;
        expect(identityMetadata.value).toBe("value");
    });

    test("should delete an IdentityMetadata", async () => {
        await client1.identityMetadata.upsertIdentityMetadata({ reference: client1Address, value: "value" });

        const result = await client1.identityMetadata.deleteIdentityMetadata(client1Address);
        expect(result).toBeSuccessfulVoidResult();

        const getResult = await client1.identityMetadata.getIdentityMetadata(client1Address);
        expect(getResult).toBeAnError("IdentityMetadata not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });
});
