import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import parser from "@typescript-eslint/parser"
import tseslint from 'typescript-eslint';

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    globalIgnores(["src/test/**/*.ts"]),
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: parser,
            parserOptions: {
                project: "tsconfig.json",
            },
        },
        rules : {
            "interface-name": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow'
                }
             ],
            "ordered-imports": "off"
        },
    }
]);