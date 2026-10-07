import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...react.configs.flat.recommended,
    rules: {
      ...react.configs.flat.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },
]);

export default eslintConfig;
