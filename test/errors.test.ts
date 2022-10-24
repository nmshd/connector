import axios, { AxiosInstance } from "axios";
import { Launcher } from "./lib/Launcher";
import { validateSchema, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let axiosClient: AxiosInstance;

beforeAll(async () => {
    const baseUrl = await launcher.launchSimple();
    axiosClient = axios.create({
        baseURL: baseUrl,
        validateStatus: (_) => true
    });
}, 30000);

afterAll(() => launcher.stop());

describe("Errors", () => {
    test("http error 401", async () => {
        const response = await axiosClient.get<any>("/api/v2/Files");
        expect(response.status).toBe(401);
        validateSchema(ValidationSchema.Error, response.data.error);
    });

    test("http error 404", async () => {
        const response = await axiosClient.get<any>("/apii/v2/Files", {
            headers: {
                "X-API-KEY": "xxx" // eslint-disable-line @typescript-eslint/naming-convention
            }
        });
        expect(response.status).toBe(404);
        validateSchema(ValidationSchema.Error, response.data.error);
    });

    test("http error 405", async () => {
        const response = await axiosClient.patch<any>("/api/v2/Files", undefined, {
            headers: {
                "X-API-KEY": "xxx" // eslint-disable-line @typescript-eslint/naming-convention
            }
        });
        expect(response.status).toBe(405);
        validateSchema(ValidationSchema.Error, response.data.error);
    });

    test("http error 400", async () => {
        const response = await axiosClient.post<any>("/api/v2/Files/Own", undefined, {
            headers: {
                "X-API-KEY": "xxx" // eslint-disable-line @typescript-eslint/naming-convention
            }
        });
        expect(response.status).toBe(400);
        validateSchema(ValidationSchema.Error, response.data.error);
    });
});
