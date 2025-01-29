import http from "http";

http.get("http://localhost/health", (res) => process.exit(res.statusCode === 200 ? 0 : 1));
