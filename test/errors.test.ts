import axios, { AxiosInstance } from "axios";
import { Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";
import { validateSchema, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let axiosClient: AxiosInstance;
const onlyCoreApiKey = `${launcher.apiKey}onlyCore`;

beforeAll(async () => {
    const apiKeys = {
        default: { key: launcher.apiKey },
        onlyCore: { key: onlyCoreApiKey, scopes: ["core:*"] }
    };

    const baseUrl = await launcher.launchSimple(apiKeys);
    axiosClient = axios.create({
        baseURL: baseUrl,
        validateStatus: (_) => true,
        headers: { "X-API-KEY": launcher.apiKey }
    });
}, getTimeout(30000));

afterAll(() => launcher.stop());

describe("Errors", () => {
    test("http error 401", async () => {
        const response = await axiosClient.get<any>("/api/v2/Files", { headers: { "X-API-KEY": "invalid" } });
        expect(response.status).toBe(401);
        validateSchema(ValidationSchema.Error, response.data.error);
    });

    test.each(["/Monitoring/Version", "/Monitoring/Requests", "/Monitoring/Support"])("http error 403 on route '%s'", async (route: string) => {
        const response = await axiosClient.get<any>(route, { headers: { "X-API-KEY": onlyCoreApiKey } });
        expect(response.status).toBe(403);
        validateSchema(ValidationSchema.Error, response.data.error);
    });

    test("http error 404", async () => {
        const response = await axiosClient.get<any>("/apii/v2/Files");
        expect(response.status).toBe(404);
        validateSchema(ValidationSchema.Error, response.data.error);
    });

    test("http error 405", async () => {
        const response = await axiosClient.patch<any>("/api/v2/Files", undefined);
        expect(response.status).toBe(405);
        validateSchema(ValidationSchema.Error, response.data.error);
    });

    test("http error 400", async () => {
        const response = await axiosClient.post<any>("/api/v2/Files/Own", undefined);
        expect(response.status).toBe(400);
        expect(response.data.error.docs).toBe("https://enmeshed.eu/integrate/error-codes#error.runtime.validation.invalidPropertyValue");
        validateSchema(ValidationSchema.Error, response.data.error);
    });
});
