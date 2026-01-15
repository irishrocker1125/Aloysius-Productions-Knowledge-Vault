---
title: "Project Status"
created: 2026-01-15
updated: 2026-01-15
type: organization
tags:
  - organization
  - status
  - projects
source: "docs/organization-overview.md"
---

# Project Status

Current state of all Aloysius Productions projects.

## Shipped & Complete (5 projects)

| Project | Version | Platform | Description |
|---------|---------|----------|-------------|
| **Eliza** | v1.0 | Web | Pattern-matching chatbot (CLI + web) |
| **Correspondence Chess** | v1.0 | Web | Two-player remote chess with text sync |
| **MadLibs** | v1.1 | iOS | Classic + Creative modes, 20 templates |
| **Quest-Forge** | v1.2 | iOS | D&D narrative game, 3 scenarios, 4 characters |
| **GTD Web** | v1.0 | Web | Getting Things Done with swipe gestures |

## In Active Development (4 projects)

| Project | Progress | Platform | Description |
|---------|----------|----------|-------------|
| **Poker** | 25% | iOS | Texas Hold'em with AI opponents |
| **SoundBoard** | Phase 1+ | Web | Interactive synthesizer (Web Audio) |
| **Walkie-Talkie** | v0.1 | Web | Audio messaging with Firebase |
| **GTD iOS** | v1.0+ | iOS | Thought capture with voice recognition |

## Foundation Stage (1 project)

| Project | Status | Platform | Description |
|---------|--------|----------|-------------|
| **Dice** | Foundation | iOS | Multi-dice roller for RPGs |

## Infrastructure Components

- **gloriously-awesome-system** - Claude Code meta-prompting system
- **aloysiusproductions-ops-core** - Governance, runbooks, dashboards
- **Aloysius family** - Knowledge vault, dashboard, event horizon, research lab, resource grid

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Projects | 10+ active |
| Shipped Projects | 5 (50%) |
| iOS Projects | 5 |
| Web Projects | 5 |
| Lines of Code | ~10,000 aggregate |
| Planning Coverage | 100% of active projects |

## What's Working Well

### 1. Planning Infrastructure
- Every project has `.planning/` with PROJECT.md, ROADMAP.md, STATE.md
- Phased development with clear milestones
- Session continuity through state tracking

### 2. Tech Stack Consistency
- **iOS**: SwiftUI across all native apps
- **Web**: React 18 + TypeScript + Vite + Vitest
- Consistent patterns across platforms

### 3. Testing Culture
- Pre-push hooks enforce test passing
- Vitest with coverage for web projects
- iOS testing with xcodebuild

### 4. Project Completion Rate
- 50% of active projects fully shipped
- Clear version numbering
- Projects reach "done" state vs perpetual development

## Areas for Growth

- Cross-project coordination
- CI/CD standardization
- iOS test coverage
- Shared component library for React

## Related

- [[organization/tech-stack|Tech Stack]]
- [[references/infrastructure/gas-deep-dive|GAS Framework Deep Dive]]
