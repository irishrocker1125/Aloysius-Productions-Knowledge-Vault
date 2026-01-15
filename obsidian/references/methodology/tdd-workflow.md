---
title: "TDD Workflow"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - methodology
  - testing
  - tdd
source: "docs/superpowers-methodology.md"
---

# TDD Workflow

Test-driven development practices based on the superpowers methodology.

## The Iron Law

> "No production code without a corresponding failing test first. Code written before tests must be deleted and reimplemented properly."

## RED-GREEN-REFACTOR Cycle

| Phase | Action | Verification |
|-------|--------|--------------|
| **RED** | Write one minimal test demonstrating required behavior | Run tests, confirm failure for *expected* reason (not typos) |
| **GREEN** | Implement simplest code satisfying only the test | All tests pass with clean output |
| **REFACTOR** | Remove duplication, improve naming | Tests still pass |

## Testing Anti-Patterns to Avoid

### 1. Testing Mock Behavior
Verifying mocks exist rather than actual code works.
- **Fix**: Test real components or remove the mock

### 2. Test-Only Methods in Production
Adding cleanup methods just for tests.
- **Fix**: Move to dedicated test utilities

### 3. Mocking Without Understanding
Over-mocking "to be safe" breaks real behavior.
- **Fix**: Understand side effects first, mock at correct level

### 4. Incomplete Mock Structures
Partial mocks missing fields downstream code needs.
- **Fix**: Mirror complete real API structure

### 5. Tests as Afterthought
Writing after implementation.
- **Fix**: TDD - failing test first, always

## Rationalizations to Reject

- "Too simple to test"
- "I'll write tests after"
- "Already manually tested"
- "Keeping as reference"

## Related

- [[references/methodology/systematic-debugging|Systematic Debugging]]
- [[references/methodology/granular-planning|Granular Planning]]
- [[references/testkitchen/testing-practices|Testing Practices]]
