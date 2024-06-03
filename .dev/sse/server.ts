import { createSession } from "better-sse";
import express from "express";

const app = express();

app.get("/sse", async (req, res) => {
    console.log("connected");

    console.log(req.headers);

    const session = await createSession(req, res);

    const interval = setInterval(() => {
        try {
            session.push({ eventName: "ExternalEventCreated" });
        } catch (error) {
            console.error("Error pushing to client:", error);
            clearInterval(interval);
        }
    }, 1000);

    session.on("close", () => {
        console.log("Client disconnected. Stopping interval.");
        clearInterval(interval);
    });
});

app.listen(3333, () => console.log("Server started on http://localhost:3333"));
