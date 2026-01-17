---
title: "Environment-aware scripts with graceful degradation"
created: 2026-01-17
updated: 2026-01-17
type: pattern
language: python
reusable: true
source_project: aloysiusproductions-ops-core
source: ops-core-sync
tags:
  - pattern
  - python
  - synced
---

# Environment-aware scripts with graceful degradation

Use `is_local_workspace_available()` pattern to detect context and skip local-only operations in CI

## Context

Scripts that run in both local and CI

## Reusability

- **Score**: 3/5
- **Used in**: aloysiusproductions-ops-core

## Source

Synced from ops-core learning data. Original source: [[projects/infrastructure/aloysiusproductions-ops-core|aloysiusproductions-ops-core]]  # noqa: E501
