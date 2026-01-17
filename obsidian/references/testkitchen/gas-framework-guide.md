---
created: 2026-01-13
type: reference
tags:
  - testkitchen
  - gas
  - planning
  - methodology
---

# GAS Framework Guide: Testkitchen Projects

Usage patterns for the Gregorian Agentic System (GAS) across testkitchen projects.

## Overview

GAS is the planning and execution framework used across all testkitchen projects. It provides:

- Structured project documentation
- Phase-based milestone delivery
- State tracking and velocity metrics
- Session continuity for AI-assisted development

## Directory Structure

Every GAS-enabled project has:

```
.planning/
├── PROJECT.md           # What, why, requirements, constraints
├── ROADMAP.md           # Milestones, phases, progress
├── STATE.md             # Current position, metrics, continuity
├── MILESTONES.md        # Release history summary
├── config.json          # GAS settings
├── agent-history.json   # Execution tracking
├── milestones/          # Archived milestone roadmaps
│   └── v1.0-ROADMAP.md
├── phases/              # Phase directories
│   ├── 01-foundation/
│   │   ├── 01-01-PLAN.md
│   │   └── 01-01-SUMMARY.md
│   └── 02-core-engine/
│       ├── 02-01-PLAN.md
│       └── 02-01-SUMMARY.md
└── codebase/            # Codebase analysis (optional)
    ├── ARCHITECTURE.md
    ├── CONVENTIONS.md
    ├── STRUCTURE.md
    ├── TESTING.md
    ├── CONCERNS.md
    ├── INTEGRATIONS.md
    └── STACK.md
```

## Document Templates

### PROJECT.md

```markdown
# Project Name

## What This Is

[1-2 sentence description]

## Core Value

[User-facing benefit]

## Requirements

### Validated ✓

- [Completed requirements]

### Active

- [In-progress requirements]

### Out of Scope

- [Explicitly excluded]

## Context

- **Status:** [Active | Complete | Foundation]
- **LOC:** [Lines of code]
- **Stack:** [Technologies]

## Constraints

- Platform: [iOS, Web, etc.]
- Framework: [SwiftUI, React, etc.]
- Storage: [UserDefaults, localStorage, etc.]

## Key Decisions

| Decision | Rationale | Outcome  |
| -------- | --------- | -------- |
| [Choice] | [Why]     | [Result] |
```

### STATE.md

```markdown
## Current Position

- Phase: N of M (phase-name)
- Plan: X of Y in current phase
- Status: [Ready to plan | In progress | Complete]
- Last activity: [date] — [what was done]

## Progress

[Visual progress indicator]

## Performance Metrics

- Total plans completed: N
- Average duration: X min
- Recent velocity: [last 5 plans]

## Accumulated Context

- Key decisions affecting current work
- Deferred issues
- Session continuity notes
```

### PLAN.md Structure

```yaml
---
phase: 01-foundation
plan: 01
type: tdd # or: execute, research
---
```

```markdown
<objective>
[Clear, single objective]
</objective>

<context>
[References to PROJECT.md, dependencies, tech stack]
</context>

<feature>
  <name>[Feature name]</name>
  <files>[Target files]</files>
  <behavior>[Expected behavior, test cases]</behavior>
  <implementation>[Step-by-step approach]</implementation>
</feature>

<verification>
[Shell command to verify completion]
</verification>

<success_criteria>

- [Specific, measurable criteria]
  </success_criteria>

<output>
[Location of deliverables]
</output>
```

### SUMMARY.md Structure

```yaml
---
phase: 01-foundation
plan: 01
duration: 45
tasks_completed: 5
files_modified: 3
---
```

```markdown
## Dependency Graph

[What this phase needed from prior work]

## Tech Stack

- Added: [New technologies/patterns]
- Files: [New/modified files]

## Key Decisions

| Decision | Rationale |
| -------- | --------- |

## Issues & Deviations

- [Differences from plan, auto-fixed bugs]

## Deferred

- [Out-of-scope items discovered]

## Next Phase Readiness

- [Checklist for proceeding]
```

## Phase Patterns

### Foundation-First Architecture

Successful projects follow this pattern:

```
Phase 1: Foundation (setup, infrastructure)
Phase 2: Core Engine (business logic)
Phase 3: Primary Interface (CLI, main UI)
Phase 4: Secondary Interface (web, additional views)
Phase 5+: Features (extensions, polish)
```

### Phase Naming Convention

```
NN-descriptive-name/
├── NN-01-PLAN.md
├── NN-01-SUMMARY.md
├── NN-02-PLAN.md
└── NN-02-SUMMARY.md
```

Examples:

- `01-hand-evaluation/`
- `02-game-flow/`
- `03-ai-players/`
- `04-game-ui/`

### Decimal Phases for Inserted Work

When urgent work needs to be inserted between phases:

- Use decimal notation: `03.1-hotfix/`
- Maintains original phase numbering
- Clear audit trail

## Velocity Metrics

### What High-Velocity Projects Have

From testkitchen analysis:

| Factor              | Pattern                    |
| ------------------- | -------------------------- |
| Phase scope         | 1-3 plans, 45-120 min each |
| Acceptance criteria | Specific, measurable       |
| Dependencies        | Explicitly stated          |
| Verification        | Shell command provided     |
| Risk flagging       | Research: Likely/Unlikely  |

### Observed Metrics

- **18 plans completed** across active projects
- **1.6 hours average** per plan
- **Foundation-first** delivery pattern
- **TDD with atomic commits** for auditability

## Configuration

### config.json Options

```json
{
  "mode": "yolo", // or: "careful"
  "depth": "standard",
  "gates": {
    "planning": true,
    "execution": true,
    "transitions": true
  },
  "safety": {
    "confirmDestructive": true
  }
}
```

### Mode Differences

| Mode      | Behavior                              |
| --------- | ------------------------------------- |
| `yolo`    | Fast execution, minimal confirmations |
| `careful` | More gates, explicit confirmations    |

## Best Practices

### Do

- Keep phases independently testable
- State dependencies explicitly
- Provide verification commands
- Write summaries capturing actual vs. planned
- Track deferred items (no scope creep)
- Use decimal phases for urgent insertions

### Don't

- Create phases with no clear deliverable
- Skip summaries (lose learning)
- Let phases depend on incomplete work
- Ignore velocity metrics
- Mix research and execution in one plan

## Commands Reference

GAS CLI commands (from project directory):

| Command             | Purpose                    |
| ------------------- | -------------------------- |
| `/gas:progress`     | Check current state        |
| `/gas:plan-phase`   | Create plan for next phase |
| `/gas:execute-plan` | Execute current plan       |
| `/gas:verify-work`  | Run verification           |
| `/gas:next-shift`   | Handoff for next session   |

## Related

- [[velocity-insights]] - Metrics that drive delivery
- [[testing-practices]] - TDD integration with GAS
- [[architecture-patterns]] - Foundation-first approach
