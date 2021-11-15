let cachedSchema: any;

export function getJSONSchemaDefinition(): any {
    if (!cachedSchema) {
        cachedSchema = require("../schemas.json"); // eslint-disable-line @typescript-eslint/no-require-imports
    }

    return cachedSchema;
}
