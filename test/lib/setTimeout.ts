import inspector from "inspector";
export function getTimeout(defaultTimeout = 60_000): number {
    const debug = inspector.url() !== undefined;
    return debug || process.env.NODE_OPTIONS?.includes("inspect") ? 999_999_999 : defaultTimeout;
}
