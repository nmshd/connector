let cachedSchema: Record<string, unknown> | undefined;

export function getJSONSchemaDefinition(): Record<string, unknown> {
    cachedSchema ??= require("../schemas.json"); // eslint-disable-line @typescript-eslint/no-require-imports

    return cachedSchema!;
}
