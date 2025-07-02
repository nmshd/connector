import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";

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
            key: undefined,
            value: "value"
        },
        {
            key: undefined,
            value: { a: "json" }
        },
        {
            key: "key",
            value: "value"
        }
    ])("should upsert an IdentityMetadata with key '$key' and value '$value'", async (data) => {
        const result = await client1.identityMetadata.upsertIdentityMetadata({ ...data, reference: client1Address });
        expect(result).toBeSuccessful();

        const identityMetadata = result.result;
        expect(identityMetadata.reference.toString()).toStrictEqual(client1Address);
        expect(identityMetadata.key).toStrictEqual(data.key);
        expect(identityMetadata.value).toStrictEqual(data.value);
    });

    test("should get an IdentityMetadata", async () => {
        await client1.identityMetadata.upsertIdentityMetadata({ reference: client1Address, value: "value" });

        const result = await client1.identityMetadata.getIdentityMetadata(client1Address);
        expect(result).toBeSuccessful();

        const identityMetadata = result.result;
        expect(identityMetadata.value).toBe("value");
    });

    test("should delete an IdentityMetadata", async () => {
        await client1.identityMetadata.upsertIdentityMetadata({ reference: client1Address, value: "value" });

        const result = await client1.identityMetadata.deleteIdentityMetadata(client1Address);
        expect(result).toBeSuccessfulVoidResult();

        const getResult = await client1.identityMetadata.getIdentityMetadata(client1Address);
        expect(getResult).toBeAnError("There is no stored IdentityMetadata for the specified combination of reference and key.", "error.runtime.identityMetadata.notFound");
    });
});
