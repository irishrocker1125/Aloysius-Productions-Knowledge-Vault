---
title: "Granular Planning"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - methodology
  - planning
source: "docs/superpowers-methodology.md"
---

# Granular Planning

Breaking work into small, verifiable tasks.

## Task Sizing

> Tasks should be completable in **2-5 minutes**, following TDD cycle

## Task Structure Template

```markdown
## Task N: [Name]

**Files:**

- Create: `path/to/new/file.ts`
- Modify: `path/to/existing/file.ts`
- Test: `path/to/test/file.test.ts`

**Steps:**

1. Write failing test for [specific behavior]
2. Verify test fails for expected reason
3. Implement minimal code to pass
4. Verify all tests pass
5. Commit: "feat: [description]"

**Verification:**
npm test -- --grep "specific test"

**Expected Output:**
✓ specific behavior works
1 passing
```

## Plan Header Format

```markdown
# Feature: [Name]

**Goal:** One sentence describing the outcome
**Architecture:** 2-3 sentences on approach
**Tech Stack:** List of technologies

## Tasks

[2-5 minute tasks follow]
```

## Key Principles

- **DRY** - Don't repeat yourself
- **YAGNI** - Don't build what you don't need yet
- **Commit frequently** - After each passing test cycle
- **Include exact commands** - With expected output
- **Full code examples** - Not vague "add validation"

## Related

- [[references/methodology/tdd-workflow|TDD Workflow]]
- [[references/methodology/systematic-debugging|Systematic Debugging]]
- [[references/testkitchen/gas-framework-guide|GAS Framework Guide]]
