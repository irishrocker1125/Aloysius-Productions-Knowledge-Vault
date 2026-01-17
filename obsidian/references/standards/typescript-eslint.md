---
title: "TypeScript & ESLint Standards"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - standards
  - typescript
  - eslint
source: "docs/typescript-eslint-standards.md"
---

# TypeScript & ESLint Standards

Standard TypeScript and ESLint configuration for projects.

## TypeScript Configuration

### Standard Settings

| Setting            | Value   | Rationale                            |
| ------------------ | ------- | ------------------------------------ |
| `target`           | ES2022  | Modern JavaScript features support   |
| `strict`           | true    | Type safety enforcement              |
| `moduleResolution` | bundler | Works with Vite/modern bundlers      |
| `isolatedModules`  | true    | Required for esbuild/swc transpilers |

### Path Aliases

Projects can use a `@shared/*` alias for shared utilities:

```typescript
import { fetchWithRetry } from "@shared/utils/fetchWithRetry";
```

### Project-Specific Overrides

- **React projects**: Add `"jsx": "react-jsx"` and DOM libs
- **Node.js projects**: Override to `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`

## ESLint Configuration

All projects use ESLint flat config format (`eslint.config.js`).

### React + TypeScript Template

```javascript
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: { react: { version: "detect" } },
  },
);
```

### Node.js + TypeScript Template

```javascript
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ["dist/", "node_modules/"] },
  {
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);
```

## Required Dependencies

### React + TypeScript

```bash
npm install -D @eslint/js eslint eslint-plugin-react eslint-plugin-react-hooks globals typescript-eslint
```

### Node.js + TypeScript

```bash
npm install -D @eslint/js eslint typescript-eslint
```

## Related

- [[references/testkitchen/typescript-conventions|TypeScript Conventions]]
- [[references/standards/monorepo-conventions|Monorepo Conventions]]
