const js = require("@eslint/js");
const globals = require("globals");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = [
    js.configs.recommended,
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^(args|message|client|interaction|e|err|error|_.*)$",
                    caughtErrorsIgnorePattern: "^(e|err|error|_.*)$",
                    varsIgnorePattern:
                        "^(EmbedBuilder|MessageReaction|GuildMember|BaseInteraction|WebhookClient|ButtonInteraction|ModalSubmitInteraction|_.*)$",
                },
            ],
            "no-undef": "error",
        },
    },
    {
        ignores: ["node_modules/**"],
    },
];
