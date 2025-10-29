import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      semi: ["error", "always"], // 🚨 require semicolons
      quotes: ["warn", "double"], // warn if not using double quotes
    },
  },
]);