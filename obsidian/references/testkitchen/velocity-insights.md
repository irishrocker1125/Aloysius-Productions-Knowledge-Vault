---
created: 2026-01-13
type: reference
tags:
  - testkitchen
  - velocity
  - metrics
  - productivity
---

# Velocity Insights: Testkitchen Projects

Analysis of what drives fast, successful delivery across 8 testkitchen projects.

## Aggregate Metrics

### Project Summary

| Project | LOC | Plans | Avg Duration | Status |
|---------|-----|-------|--------------|--------|
| Poker | 4,080 | 8 | ~60 min | v1.1 shipped |
| Eliza | 1,523 | 8 | ~45 min | v1.0 shipped |
| QuestForge | 2,253 | 12 | ~90 min | v1.2 shipped |
| MadLibs | 1,523 | 14 | ~45 min | v1.1 shipped |
| GTD | 970 | 9 | ~60 min | v1.0 shipped |

**Totals:**
- **~10,349 LOC** across 8 projects
- **~51 plans** completed
- **~1.6 hours** average per plan
- **5 projects** shipped to v1.0+

### Delivery Timeline Examples

**Poker (fastest):**
- Started: 2026-01-11
- v1.0 shipped: 2026-01-11 (same day, 4 phases)
- v1.1 shipped: 2026-01-12 (next day, 3 phases)

**Eliza:**
- Started: 2026-01-10
- v1.0 shipped: 2026-01-10 (same day, 7 phases)

## Success Factors

### 1. Foundation-First Architecture

Projects that ship fastest follow this pattern:

```
Foundation → Infrastructure → Features
```

**Why it works:**
- Each layer is testable in isolation
- Dependencies flow one direction
- No circular dependencies or rework

**Example (Poker):**
1. Hand Evaluation (pure logic, no UI)
2. Game Flow (orchestration, no UI)
3. AI Players (decision engine, no UI)
4. Game UI (integration, visual layer)

### 2. Tight Phase Scoping

**Optimal phase characteristics:**
- 1-3 plans per phase
- 45-120 minutes per plan
- Single, clear deliverable
- Independently verifiable

**Anti-pattern:** Phases with 5+ plans, unclear boundaries, or mixed concerns.

### 3. TDD with Atomic Commits

Projects using strict TDD deliver faster:

```bash
# Atomic commit pattern
test: add failing tests for hand comparison
feat: implement hand comparison logic
refactor: extract card sorting helper
```

**Benefits:**
- Bugs caught early (before they compound)
- Clear audit trail for debugging
- Confidence to refactor
- Faster code review

### 4. Explicit Dependencies

Plans that state dependencies clearly execute faster:

```markdown
## Dependencies
- Requires Phase 01 (HandRank enum, EvaluatedHand struct)
- Uses CardSorting from 01-01
```

**Why it works:**
- No ambiguity about prerequisites
- Can parallelize independent work
- Clear when blocked

### 5. Verification Commands

Plans with explicit verification commands complete cleanly:

```markdown
<verification>
swift test --filter HandComparisonTests
</verification>
```

**Why it works:**
- Objective success criteria
- Can automate checks
- No debate about "done"

## Velocity Killers

### 1. Research Mid-Execution

**Problem:** Discovering unknowns during implementation.

**Solution:** Flag research upfront:
```yaml
type: research  # or: tdd, execute
```

Research phases:
- Investigate options
- Prototype approaches
- Document findings
- THEN execute with confidence

### 2. Scope Creep

**Problem:** Adding "just one more thing" during a phase.

**Solution:** Deferred items log in SUMMARY.md:
```markdown
## Deferred
- Animation polish (not in scope for v1.0)
- Settings screen (moved to Phase 5)
```

### 3. Incomplete Handoffs

**Problem:** Context lost between sessions.

**Solution:** STATE.md with:
- Current position (phase/plan)
- Last activity
- Accumulated decisions
- Next steps

### 4. No Summaries

**Problem:** Same mistakes repeated.

**Solution:** Every plan gets a SUMMARY.md documenting:
- Actual vs. planned
- Issues encountered
- Decisions made
- Lessons learned

## Velocity Optimization Checklist

### Before Starting a Phase

- [ ] Dependencies stated and satisfied
- [ ] Research completed (if needed)
- [ ] Scope is achievable in 45-120 min
- [ ] Success criteria are specific

### During Execution

- [ ] One plan in progress at a time
- [ ] Atomic commits (test → feat → refactor)
- [ ] Deferred items logged (not ignored)
- [ ] Verification command works

### After Completion

- [ ] SUMMARY.md written immediately
- [ ] Deferred items triaged
- [ ] STATE.md updated
- [ ] Next phase prerequisites clear

## Patterns by Project Type

### Game Projects (Poker, QuestForge)

**Pattern:** Logic → AI → UI

High velocity because:
- Game rules are pure functions
- AI can be tested with deterministic inputs
- UI is final integration layer

### Tool Projects (Eliza, GTD)

**Pattern:** Engine → CLI → Web

High velocity because:
- Core logic is platform-agnostic
- CLI validates API design
- Web adds convenience layer

### Content Projects (MadLibs)

**Pattern:** Data → Logic → Presentation

High velocity because:
- Content (stories) is independent
- Logic is simple transformation
- UI is primarily display

## Recommendations

### For New Projects

1. Start with PROJECT.md (requirements, constraints)
2. Break into foundation-first phases
3. Use TDD from the start
4. Keep phases to 1-3 plans
5. Write summaries religiously

### For Existing Projects

1. Audit current state (STATE.md)
2. Identify completed vs. in-progress work
3. Create codebase/ documentation
4. Resume with explicit dependencies

### For Stalled Projects

1. Document what's blocking progress
2. Create research phase if unknowns exist
3. Reduce scope to smallest deliverable
4. Ship v0.1, then iterate

## Related

- [[gas-framework-guide]] - Planning system details
- [[testing-practices]] - TDD workflow
- [[architecture-patterns]] - Foundation-first approach
