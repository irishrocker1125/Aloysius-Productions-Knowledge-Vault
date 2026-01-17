---
title: "Technical Debt Registry"
created: 2026-01-16
updated: 2026-01-16
type: registry
source: ops-core-sync
tags:
  - organization
  - technical-debt
  - synced
---

# Technical Debt Registry

Aggregated technical debt across all projects. Updated daily from ops-core.

## Summary

- **Total Items**: 6
- **High Priority**: 0
- **Medium Priority**: 2
- **Low Priority**: 4
- **Estimated Hours**: 16

## By Project

### [[projects/web/eliza|Eliza]]

| Item | Priority | Notes |
|------|----------|-------|
| No persistent conversation history | low | By design for v1.0, could add later |
| Rules hardcoded in module | low | Could externalize to JSON for easier editing |

### [[projects/web/soundboard|SoundBoard]]

| Item | Priority | Notes |
|------|----------|-------|
| No persistence for custom sounds | medium | Planned for v0.3 |
| Limited to 9 sounds | low | Grid layout constraint |

### [[projects/web/aloysius-dashboard|aloysius-dashboard]]

| Item | Priority | Notes |
|------|----------|-------|
| No tests | medium | Add unit tests for components |
| No README | low | Document setup and usage |


---

*Last synced: 2026-01-16*
