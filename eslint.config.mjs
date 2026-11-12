// @ts-check

import { configs } from "@js-soft/eslint-config-ts";
import { globalIgnores } from "eslint/config";
import vitest from "@vitest/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
    globalIgnores(["**/Schemas.ts", "**/dist", "**/dist-test", "**/scripts", "**/coverage", "**/.dev", "**/node_modules", "eslint.config.mjs"]),
    {
        extends: [configs.base],
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.eslint.json", "./tsconfig.json", "./test/tsconfig.json", "./packages/*/tsconfig.json", "./packages/*/test/tsconfig.json"]
            }
        },
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "default",
                    format: ["camelCase"],
                    leadingUnderscore: "allow"
                },
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE"],
                    leadingUnderscore: "allow"
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"]
                },
                {
                    selector: "enumMember",
                    format: ["PascalCase"]
                },
                {
                    selector: "classProperty",
                    format: ["camelCase", "UPPER_CASE"],
                    leadingUnderscore: "allow"
                },
                {
                    selector: "property",
                    format: null,
                    custom: {
                        regex: "^(@type|@version|@context|(\\$?[a-z0-9]+)([A-Z][a-z0-9]*)*)(\\.(@type|@version|@context|[a-z0-9]+([A-Z][a-z0-9]*)*))*|[xX]-[a-zA-Z]+(-[a-zA-Z]+)*$",
                        match: true
                    }
                }
            ]
        }
    },
    {
        files: ["test/**/*.ts"],
        extends: [vitest.configs.env],
        plugins: { vitest },
        rules: {
            ...vitest.configs.recommended.rules,
            "vitest/no-conditional-in-test": "error",
            "vitest/expect-expect": ["error", { assertFunctionNames: ["expect", "*.executeTests", "validateSchema"] }]
        }
    }
);
