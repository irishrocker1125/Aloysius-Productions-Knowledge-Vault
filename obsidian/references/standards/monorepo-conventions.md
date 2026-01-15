---
title: "Monorepo Conventions"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - standards
  - monorepo
  - conventions
source: "docs/developer-guide.md"
---

# Monorepo Conventions

Project organization and conventions for a multi-project repository.

## Project Types

| Type | Description | Examples |
|------|-------------|----------|
| **Local** | Native to this repo | iOS apps, utilities |
| **Submodule** | Git submodules | External dependencies, libraries |
| **Library** | Knowledge repos | Research, documentation |
| **Shared** | Cross-project code | Utilities, AI patterns |

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `docs/` | Methodology guides |
| `shared/` | Shared utilities |
| `shared-resources/` | AI patterns, scripts |

## Technology Conventions

### iOS Projects
- SwiftUI + MVVM architecture
- iOS 17+ deployment target
- @Observable for state management

### Web Projects
- React 18 + TypeScript
- Vite for building
- Vitest for testing

### Testing
- Required before push (enforced by hooks)
- TDD workflow: RED → GREEN → REFACTOR

### Planning
- Every active project has `.planning/` directory
- GAS framework for workflow management

## Common Tasks

```bash
# Run all tests
npm test

# iOS tests only
npm run test:ios

# Node tests only
npm run test:node

# Check git status across all projects
npm run status

# Sync submodules to latest
npm run sync
```

## Related

- [[references/standards/typescript-eslint|TypeScript & ESLint Standards]]
- [[references/methodology/granular-planning|Granular Planning]]
