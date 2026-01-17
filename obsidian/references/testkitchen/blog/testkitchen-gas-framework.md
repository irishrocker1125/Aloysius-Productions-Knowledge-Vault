---
title: "The Planning System Behind 1.6-Hour Deliveries: How GAS Changed How I Build"
slug: "testkitchen-gas-framework"
status: draft
created: 2026-01-13
modified: 2026-01-13
published: null
author: "Aloysius Productions"
tags:
  - productivity
  - planning
  - methodology
  - gas
  - ai-assisted
categories:
  - Productivity
  - Methodology
seo:
  description: "How a structured planning system (GAS) enabled shipping 51 execution plans averaging 1.6 hours each across 8 projects."
  keywords:
    - software planning
    - project methodology
    - agile alternative
    - ai assisted development
    - productivity system
featured_image: null
wordpress_id: null
series: "Building Apps in Public"
series_order: 5
---

## TL;DR

The GAS (Gregorian Agentic System) framework structures work into phases and plans with explicit dependencies, verification steps, and summaries. Result: 51 completed plans averaging 1.6 hours each. Here's how it works.

---

## Introduction

The testkitchen projects started chaotic. Ideas everywhere. Half-finished features. No clear sense of progress.

Then I adopted GAS—a planning framework designed for AI-assisted development. Everything changed.

This isn't about AI, though. The principles work regardless of how you code.

---

## The Core Idea

### Break Work Into Phases

A phase is a coherent unit of work:

- Has a single, clear deliverable
- Can be tested independently
- Takes 1-3 "plans" to complete

### Break Phases Into Plans

A plan is one focused session:

- 45-120 minutes
- Single objective
- Explicit success criteria

---

## The Document Structure

Every project has a `.planning/` directory:

```
.planning/
├── PROJECT.md       # What, why, requirements
├── ROADMAP.md       # Milestones and phases
├── STATE.md         # Current position
├── phases/
│   ├── 01-foundation/
│   │   ├── 01-01-PLAN.md
│   │   └── 01-01-SUMMARY.md
│   └── 02-core-engine/
│       ├── 02-01-PLAN.md
│       └── 02-01-SUMMARY.md
```

---

## The PLAN Document

Every execution session starts with a plan:

```markdown
## Objective

Implement hand comparison and winner determination.

## Dependencies

- Phase 01 complete (HandRank enum, EvaluatedHand struct)

## Success Criteria

- [ ] compare() function returns correct winner
- [ ] Tie detection works for identical ranks
- [ ] Kicker comparison handles all edge cases

## Verification

swift test --filter HandComparisonTests
```

### Why This Works

1. **Scope is clear** - You know exactly what "done" means
2. **Dependencies are explicit** - No surprises mid-session
3. **Verification is automated** - Run one command to check

---

## The SUMMARY Document

After each session, write what actually happened:

```markdown
## What Was Done

- Implemented hand comparison (compare function)
- Added 15 test cases for edge cases
- Fixed kicker comparison bug discovered during testing

## Deviations from Plan

- Added split pot detection (not planned, but needed)

## Issues Discovered

- Ace-low straight not handling correctly (deferred to Phase 3)

## Duration

67 minutes

## Next Phase Readiness

- [x] All tests passing
- [x] Code reviewed
- [ ] Ace-low straight fix (deferred)
```

### Why This Works

1. **Honest retrospective** - Plan vs. reality
2. **Deferred items tracked** - No lost context
3. **Duration recorded** - Velocity data

---

## The Foundation-First Pattern

Projects that shipped fastest followed this architecture:

```
Phase 1: Foundation (setup, types, infrastructure)
Phase 2: Core Engine (business logic, no UI)
Phase 3: Primary Interface (CLI or main UI)
Phase 4: Secondary Interface (web or additional views)
Phase 5+: Features (polish, extensions)
```

### Why This Order?

1. **Foundation** - Establishes patterns, catches design issues early
2. **Core Engine** - Pure logic, easy to test, no UI complexity
3. **Primary Interface** - Validates the engine works
4. **Secondary Interface** - Builds on working core
5. **Features** - Polish on a solid base

---

## Velocity Metrics

### The Numbers

| Project    | Plans | Avg Duration | Result       |
| ---------- | ----- | ------------ | ------------ |
| Poker      | 8     | 60 min       | v1.1 shipped |
| Eliza      | 8     | 45 min       | v1.0 shipped |
| QuestForge | 12    | 90 min       | v1.2 shipped |
| MadLibs    | 14    | 45 min       | v1.1 shipped |
| GTD        | 9     | 60 min       | v1.0 shipped |

**Totals:** 51 plans, ~1.6 hours average

### What Drives Speed

1. **Tight scope** - 45-120 minutes per plan
2. **Explicit dependencies** - No blocking surprises
3. **Verification commands** - Instant feedback
4. **Summaries** - Learn from each session

---

## What Kills Velocity

### 1. Research During Execution

**Problem:** Discovering unknowns mid-session.

**Solution:** Flag research upfront:

```yaml
type: research # vs. tdd or execute
```

Research sessions explore. Execution sessions deliver.

### 2. Scope Creep

**Problem:** "Just one more thing..."

**Solution:** Deferred items in SUMMARY:

```markdown
## Deferred

- Animation polish (moved to v1.1)
- Settings screen (not MVP)
```

Write it down. Move on.

### 3. Context Loss

**Problem:** Forgetting where you left off.

**Solution:** STATE.md:

```markdown
## Current Position

- Phase: 3 of 4
- Plan: 1 of 2
- Status: In progress
- Last: 2026-01-12 — Completed hand evaluation tests
```

---

## The STATE Document

The single source of truth for project position:

```markdown
## Current Position

- Phase: 3 of 4 (game-ui)
- Plan: 2 of 3
- Status: Ready to execute
- Last activity: 2026-01-12 — Completed betting controls

## Progress

████████████░░░░ 75%

## Accumulated Decisions

- Using spring animation (0.3s, 0.7 damping)
- Cards dealt face-down, revealed on showdown
- AI thinking delay: 0.5-1.5 seconds

## Deferred Issues

- Ace-low straight (Phase 3, Plan 3)
- Sound effects (v1.1)
```

---

## Practical Implementation

### Starting a New Project

1. Create `PROJECT.md` with requirements
2. Break into phases (foundation first)
3. Create first `PLAN.md`
4. Execute
5. Write `SUMMARY.md`
6. Update `STATE.md`
7. Repeat

### Resuming Work

1. Read `STATE.md` - Where am I?
2. Read last `SUMMARY.md` - What happened?
3. Create next `PLAN.md` or continue current
4. Execute

### Stalled Projects

1. Document blockers in `STATE.md`
2. Create research phase if unknowns exist
3. Reduce scope to smallest deliverable
4. Ship something, then iterate

---

## The Checklist

### Before Each Plan

- [ ] Dependencies satisfied
- [ ] Scope is 45-120 min
- [ ] Success criteria are specific
- [ ] Verification command ready

### After Each Plan

- [ ] SUMMARY written immediately
- [ ] Deferred items logged
- [ ] STATE updated
- [ ] Next plan clear

---

## Why This Works

GAS isn't magic. It's discipline:

1. **Write it down** - Plans, summaries, state
2. **Keep it small** - 45-120 minute chunks
3. **Be honest** - Plan vs. reality in summaries
4. **Track velocity** - What actually takes how long

The framework doesn't do the work. It makes the work visible.

---

## Conclusion

51 plans. 1.6 hours average. 5 projects shipped.

The secret isn't working faster. It's:

- Knowing exactly what "done" means
- Breaking work into testable pieces
- Learning from each session

GAS gave me that structure. The results speak for themselves.

---

_This post concludes the "Building Apps in Public" series. See the [overview](/blog/testkitchen-overview-10k-lines) for the full index._
