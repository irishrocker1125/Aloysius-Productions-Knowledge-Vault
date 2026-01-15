---
title: "Tech Stack"
created: 2026-01-15
updated: 2026-01-15
type: organization
tags:
  - organization
  - tech-stack
  - architecture
source: "docs/organization-overview.md"
---

# Tech Stack

Technology choices and architecture across all projects.

## iOS Stack

```
SwiftUI + Swift
├── @Observable / @Published patterns
├── NavigationStack (iOS 17+)
├── CoreData / UserDefaults for persistence
└── Xcode project-based builds
```

### Key Choices

| Choice | Rationale |
|--------|-----------|
| SwiftUI only | Modern, declarative UI framework |
| iOS 17+ target | Access to @Observable, latest APIs |
| No external deps | Simplicity, no package management |
| Value types | Predictable state, easy testing |

### iOS Projects

- Poker
- MadLibs
- Quest-Forge
- GTD iOS
- Dice

## Web Stack

```
React 18 + TypeScript 5.3 + Vite
├── Vitest for testing
├── Tailwind CSS for styling
├── Express (backend where needed)
├── Firebase (auth, realtime)
└── Web Audio API (SoundBoard)
```

### Key Choices

| Choice | Rationale |
|--------|-----------|
| TypeScript strict | Type safety, better tooling |
| Vite | Fast dev server, modern bundler |
| Vitest | Jest-compatible, fast, ESM native |
| Tailwind | Utility-first, consistent styling |

### Web Projects

- Eliza
- SoundBoard
- Correspondence Chess
- GTD Web
- Walkie-Talkie

## Infrastructure

```
gloriously-awesome-system (GAS)
├── Spec-driven development
├── Agent configuration
├── Planning templates
└── Meta-prompting for Claude Code
```

### DevOps

| Tool | Purpose |
|------|---------|
| GitHub Actions | CI/CD automation |
| GitHub Pages | Static site hosting |
| Husky | Pre-commit hooks |
| TruffleHog | Secret scanning |

## Testing Strategy

### iOS
- XCTest framework
- xcodebuild for CI
- Pre-push hook enforcement

### Web
- Vitest with coverage
- React Testing Library
- Pre-commit validation

## Code Quality

| Standard | Enforcement |
|----------|-------------|
| TypeScript strict | tsconfig |
| ESLint rules | Flat config |
| ARIA accessibility | Component review |
| Dark theme default | Design system |

## Architecture Patterns

### Cross-Platform

| Pattern | iOS | Web |
|---------|-----|-----|
| State management | @Observable | Context + Reducer |
| Navigation | NavigationStack | React Router |
| Persistence | UserDefaults | localStorage |
| Testing | XCTest | Vitest |

### Shared Principles

- **TDD first** - Tests before implementation
- **Atomic commits** - One change per commit
- **Foundation-first** - Setup before features
- **Co-located styles** - CSS with components

## Related

- [[organization/project-status|Project Status]]
- [[references/standards/typescript-eslint|TypeScript & ESLint Standards]]
- [[references/testkitchen/architecture-patterns|Architecture Patterns]]
