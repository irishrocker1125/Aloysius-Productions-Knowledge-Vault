---
title: "Threshold-based resource alerting"
created: 2026-01-16
updated: 2026-01-16
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

# Threshold-based resource alerting

Use percentage-based thresholds (50% warning, 80% critical) with emoji status indicators (🟢🟡🔴). Create Linear issues automatically for critical alerts. See `scripts/quota_tracker.py`.

## Context

Any quota/limit monitoring

## Reusability

- **Score**: 3/5
- **Used in**: aloysiusproductions-ops-core

## Source

Synced from ops-core learning data. Original source: [[projects/infrastructure/aloysiusproductions-ops-core|aloysiusproductions-ops-core]]
