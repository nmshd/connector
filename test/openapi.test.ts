import axios, { AxiosInstance } from "axios";
import { Launcher } from "./lib/Launcher";

const launcher = new Launcher();
let axiosClient: AxiosInstance;

beforeAll(async () => {
    const baseUrl = await launcher.launchSimple();
    axiosClient = axios.create({
        baseURL: baseUrl,
        maxRedirects: 0,
        validateStatus: (_) => true
    });
}, 30000);

afterAll(() => launcher.stop());

describe("API documentation", () => {
    test("the route /docs should redirect to /docs/swagger", async () => {
        const response = await axiosClient.get("/docs");
        expect(response.status).toBe(301);
        expect(response.headers.location).toContain("/docs/swagger/");
    });

    test("the route /docs/swagger/ should return Swagger UI html", async () => {
        const response = await axiosClient.get("/docs/swagger/");
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toContain("text/html");
        expect(response.data).toContain('<div id="swagger-ui">');
    });

    test("the route /docs/rapidoc/ should return RapiDoc html", async () => {
        const response = await axiosClient.get("/docs/rapidoc/");
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toContain("text/html");
        expect(response.data).toContain("<rapi-doc");
    });
});
