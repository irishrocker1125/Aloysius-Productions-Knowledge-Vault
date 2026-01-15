---
title: "Systematic Debugging"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - methodology
  - debugging
source: "docs/superpowers-methodology.md"
---

# Systematic Debugging

A 4-phase approach to root cause investigation.

## The Core Rule

> **"NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST"**

## Phase 1: Root Cause Investigation

1. **Examine error messages thoroughly** - Don't skip warnings or partial traces
2. **Achieve consistent reproduction** - Can you trigger it reliably?
3. **Review recent modifications** - git history, new deps, config changes
4. **Add diagnostic instrumentation** - Log at component boundaries
5. **Trace data backward** - Follow the problematic value upstream

## Phase 2: Pattern Analysis

- Find similar working code in your codebase
- Study reference implementations completely
- Catalog every difference between working and broken
- Document all dependencies and assumptions

## Phase 3: Hypothesis Testing

- Form specific hypothesis: "X causes the issue because Y"
- Test with minimal changes (one variable per test)
- Accept/reject based on results
- **Never combine multiple fixes simultaneously**

## Phase 4: Implementation

1. Create failing test demonstrating the bug
2. Implement single, targeted fix for root cause
3. Verify test passes, no regressions
4. **CRITICAL: If 3 fixes fail, question the architecture**

## Root Cause Tracing Technique

```
Symptom → Immediate Cause → What Called This? → Keep Tracing → Original Trigger
```

### When Manual Tracing Fails

Add instrumentation:
- Debug statements *before* dangerous operations
- Use `console.error()` in tests (loggers may be suppressed)
- Include context: paths, env vars, timestamps
- Capture stack: `new Error().stack`

## Red Flags (Reset to Phase 1)

- Proposing quick fixes before understanding
- Testing multiple changes simultaneously
- Making assumptions without verification
- Fourth fix attempt after three failures
- Each fix reveals different problems

## Related

- [[references/methodology/tdd-workflow|TDD Workflow]]
- [[references/methodology/granular-planning|Granular Planning]]
