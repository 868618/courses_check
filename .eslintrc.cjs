// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require("eslint-define-config")

module.exports = defineConfig({
  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: ["eslint:recommended"],

  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },

      plugins: ["@typescript-eslint", "prettier"],
    },
  ],

  rules: {
    "prettier/prettier": "error",
    "no-async-promise-executor": 0,
  },
})
