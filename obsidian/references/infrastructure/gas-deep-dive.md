---
title: "GAS Framework Deep Dive"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - infrastructure
  - gas
  - planning
  - methodology
source: "docs/superpowers-methodology.md"
---

# GAS Framework Deep Dive

The Gregorian Agentic System (GAS) is the planning and execution framework used across all projects.

## Core Philosophy

GAS provides structured project delivery through:
- **Phase-based milestones** - Incremental delivery
- **State tracking** - Session continuity
- **Velocity metrics** - Performance visibility
- **Agent configuration** - Workflow automation

## Directory Structure

Every GAS project maintains:

```
.planning/
├── PROJECT.md           # What, why, requirements
├── ROADMAP.md           # Milestones and phases
├── STATE.md             # Current position, metrics
├── MILESTONES.md        # Release history
├── config.json          # GAS settings
├── phases/              # Phase directories
│   ├── 01-foundation/
│   │   ├── 01-01-PLAN.md
│   │   └── 01-01-SUMMARY.md
│   └── 02-core-engine/
└── codebase/            # Analysis docs (optional)
    ├── ARCHITECTURE.md
    └── CONVENTIONS.md
```

## Document Lifecycle

### 1. PROJECT.md (Static)

Defines the project scope and constraints:
- Core value proposition
- Requirements (validated, active, out of scope)
- Technical constraints
- Key decisions

### 2. ROADMAP.md (Evolving)

Tracks milestone and phase progress:
- Visual progress indicators
- Phase descriptions
- Completion status

### 3. STATE.md (Dynamic)

Current execution state:
- Current phase and plan position
- Velocity metrics
- Session continuity notes
- Deferred items

### 4. PLAN.md (Per-Phase)

Execution plan with structured format:

```xml
<objective>
Single clear goal
</objective>

<context>
Dependencies and references
</context>

<feature>
  <name>Feature Name</name>
  <behavior>Test cases</behavior>
  <implementation>Step-by-step</implementation>
</feature>

<verification>
Shell command to verify
</verification>

<success_criteria>
- Specific measurable outcomes
</success_criteria>
```

### 5. SUMMARY.md (Post-Execution)

Captures what actually happened:
- Actual duration
- Key decisions made
- Issues and deviations
- Deferred items
- Next phase readiness

## Phase Patterns

### Foundation-First Architecture

Successful delivery follows:

```
Phase 1: Foundation (setup, infrastructure)
Phase 2: Core Engine (business logic)
Phase 3: Primary Interface (main UI)
Phase 4: Secondary Features (extensions)
```

### Decimal Phases for Urgent Work

Insert work without renumbering:
- `03.1-hotfix/` between 03 and 04
- Maintains audit trail
- Clear priority signal

## Velocity Metrics

### What High-Velocity Projects Share

| Factor | Pattern |
|--------|---------|
| Phase scope | 1-3 plans, 45-120 min each |
| Acceptance criteria | Specific, measurable |
| Dependencies | Explicitly stated |
| Verification | Shell command provided |

### Observed Metrics

- **51 plans completed** across projects
- **1.6 hours average** per plan
- **Foundation-first** delivery
- **TDD with atomic commits**

## Commands

| Command | Purpose |
|---------|---------|
| `/gas:progress` | Check current state |
| `/gas:plan-phase` | Create next phase plan |
| `/gas:execute-plan` | Execute current plan |
| `/gas:verify-work` | Run verification |
| `/gas:next-shift` | Session handoff |

## Best Practices

### Do
- Keep phases independently testable
- State dependencies explicitly
- Provide verification commands
- Write summaries capturing actual vs. planned
- Track deferred items

### Don't
- Create phases with no clear deliverable
- Skip summaries
- Let phases depend on incomplete work
- Mix research and execution in one plan

## Related

- [[references/testkitchen/gas-framework-guide|GAS Framework Guide]]
- [[references/methodology/granular-planning|Granular Planning]]
- [[references/testkitchen/velocity-insights|Velocity Insights]]
