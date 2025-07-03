import http from "http";
import { createConnectorConfig } from "./createConnectorConfig";

const config = createConnectorConfig();
const port = config.infrastructure.httpServer.port ?? 80;
const healthCheckUrl = `http://localhost:${port}/health`;

http.get(healthCheckUrl, (res) => process.exit(res.statusCode === 200 ? 0 : 1));
