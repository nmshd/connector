import express from "express";

const app = express();

app.use(express.json());
app.use((req, res) => {
    Object.keys(events).forEach((key) => {
        events[key]?.push(req.body);
    });
    res.send("OK");
});

interface EventData {
    trigger: string;
    data: any;
}
const events: Record<string, EventData[] | undefined> = {};

const server = app.listen(3769);

export function getEvents(name: string): EventData[] {
    return events[name] ?? [];
}

export function startEventLog(name: string): void {
    events[name] = [];
}

export function stopEventLog(name: string): void {
    delete events[name];
}

afterAll(() => {
    server.close();
});
