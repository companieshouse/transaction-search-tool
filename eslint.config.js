const { defineConfig } = require("eslint/config");
const eslint = require("@eslint/js");
const parser  = require("@typescript-eslint/parser");
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
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
