import { CoreDate } from "@nmshd/core-types";
import express from "express";

declare global {
    namespace Express {
        interface Request {
            apiKey?: {
                validateApiKey(apiKey: string): { isValid: boolean; scopes?: string[] };
            };
        }
    }
}

export interface ApiKeyAuthenticationConfig {
    enabled?: boolean;
    headerName: string;
    keys: Record<
        string,
        {
            enabled?: boolean;
            key: string;
            description?: string;
            expiresAt?: string;
            scopes?: string[];
        }
    >;
}

export function apiKeyAuth(config: ApiKeyAuthenticationConfig): express.RequestHandler {
    if (!isApiKeyAuthenticationEnabled(config)) throw new Error("API key authentication is not enabled in configuration. At least one API key is required.");

    const apiKeys = getValidApiKeys(config);
    return (req: express.Request, _res: express.Response, next: express.NextFunction) => {
        const validateApiKey = (apiKey: string): { isValid: boolean; scopes?: string[] } => {
            const matchingApiKey = apiKeys.find((keyDefinition) => keyDefinition.apiKey === apiKey);

            // even if the API key is found, we need to check if it is still valid because it might have been expired between server start and request
            if (!matchingApiKey || matchingApiKey.expiresAt?.isExpired()) return { isValid: false };

            return { isValid: true, scopes: matchingApiKey.scopes };
        };

        req.apiKey = { validateApiKey };

        next();
    };
}

export function isApiKeyAuthenticationEnabled(config: ApiKeyAuthenticationConfig): boolean {
    return config.enabled ?? Object.keys(config.keys).length !== 0;
}

function getValidApiKeys(config: ApiKeyAuthenticationConfig): { apiKey: string; expiresAt?: CoreDate; scopes?: string[] }[] {
    const configuredApiKeys = config.keys;

    const allApiKeys = Object.values(configuredApiKeys).map((def) => def.key);
    if (allApiKeys.length !== new Set(allApiKeys).size) {
        throw new Error("Duplicate API keys found in configuration. Each API key must be unique.");
    }

    const validApiKeys = Object.entries(configuredApiKeys)
        .filter((apiKey) => apiKey[1].enabled !== false)
        .filter((apiKey) => apiKey[1].expiresAt === undefined || !CoreDate.from(apiKey[1].expiresAt).isExpired());

    if (validApiKeys.length === 0) throw new Error("No valid API keys found in configuration. At least one is required.");

    const apiKeyPolicy = /^(?=.*[A-Z].*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z]).{30,}$/;
    const apiKeysViolatingThePolicy = validApiKeys.filter((apiKey) => !apiKey[1].key.match(apiKeyPolicy));
    if (apiKeysViolatingThePolicy.length !== 0) {
        throw new Error(
            `The API keys with the following key(s) does not meet the requirements: ${apiKeysViolatingThePolicy.map((k) => k[0]).join(", ")}. They must be at least 30 characters long and contain at least 2 digits, 2 uppercase letters, 2 lowercase letters and 1 special character (!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~).`
        );
    }

    return validApiKeys.map((apiKey) => ({ apiKey: apiKey[1].key, expiresAt: apiKey[1].expiresAt ? CoreDate.from(apiKey[1].expiresAt) : undefined, scopes: apiKey[1].scopes }));
}
