import axios, { AxiosInstance } from "axios";
import { Launcher } from "./lib/Launcher";

const launcher = new Launcher();
let axiosClient: AxiosInstance;

beforeAll(async () => {
    const baseURL = await launcher.launchSimple();
    axiosClient = axios.create({ baseURL, maxRedirects: 0, validateStatus: (_) => true });
}, 30000);

afterAll(() => launcher.stop());

/**
 * Because of a bug when using axios in the jest runtime the response headers are empty.
 * Therefore we cannot check the response headers.
 */

describe("API documentation", () => {
    test("the route /docs should redirect to /docs/swagger", async () => {
        const response = await axiosClient.get("/docs");
        expect(response.status).toBe(301);
        // expect(response.headers.location).toContain("/docs/swagger");
    });

    test("the route /docs/swagger should return Swagger UI html", async () => {
        const response = await axiosClient.get("/docs/swagger/");
        expect(response.status).toBe(200);
        expect(response.data).toContain('<div id="swagger-ui">');
        // expect(response.headers["content-type"]).toContain("text/html");
    });

    test("the route /docs/rapidoc/ should return RapiDoc html", async () => {
        const response = await axiosClient.get("/docs/rapidoc/");
        expect(response.status).toBe(200);
        expect(response.data).toContain("<rapi-doc");
        // expect(response.headers["content-type"]).toContain("text/html");
    });

    test("the /favicon.ico route should be accessible", async () => {
        const response = await axiosClient.get("/favicon.ico");
        expect(response.status).toBe(200);
        // expect(response.headers["content-type"]).toContain("image/x-icon");
    });
});
