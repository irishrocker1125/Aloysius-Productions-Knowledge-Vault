---
title: "AloysiusProductions Ops Core"
created: 2026-01-18
updated: 2026-01-18
type: project
project: ops-core
platform: infrastructure
version: v1.0
status: active
tags:
  - project
  - infrastructure
  - devops
  - automation
  - github-actions
source: "aloysiusproductions-ops-core/.management/knowledge.md"
---

# AloysiusProductions Ops Core

Core operational infrastructure for Aloysius Productions projects, including CI/CD pipelines, shared workflows, automation tooling, and dashboard aggregation.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Data preservation over fresh calculation | Prevent corrupted metrics when sources unavailable | Good |
| Environment-aware script design | Scripts must work in both local and CI contexts | Good |
| Threshold-based alerting (50% warn, 80% critical) | Proactive monitoring before hitting limits | Good |
| Reusable GitHub Actions workflows | Centralize security scanning across all repos | Good |
| Stale data indicator (†) | Users know when viewing preserved data | Good |
| Scheduled dashboard updates (6hr cron) | Balance freshness with API rate limits | Good |

## Patterns Established

| Pattern | Description | Reusable |
|---------|-------------|----------|
| Data preservation pattern | Preserve last-known-good values when calculation impossible | Yes |
| Environment-aware scripts | Detect local vs CI and degrade gracefully | Yes |
| Threshold-based resource alerting | 50%/80% warning/critical thresholds | Yes |
| Security-gated deployment | Block deploys on security scan failures | Yes |
| Reusable workflow pattern | Centralized workflows called by projects | Yes |

## Lessons Learned

| Lesson | Context | Impact |
|--------|---------|--------|
| GitHub has 13+ rate limit categories | Search API is 30/min, Code Search is 10/min | Track all limits, not just core |
| CI runs without local workspace | Dashboard showed 11k LOC instead of 147k | Always detect execution context |
| Incomplete data is worse than stale data | Metrics corruption from partial calculation | Preserve over calculate when uncertain |
| Manual curation causes data drift | Knowledge Vault had stale project status, ghost references | Implement validation + quarterly audits |

## Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| No automated rollback | Medium | Manual intervention required on bad deploys |
| Dashboard caching is file-based | Low | Could use Redis for multi-instance |

## Related

- [[projects/web/aloysius-dashboard|Aloysius Dashboard]] - Dashboard for monitoring infrastructure
- [[references/infrastructure/ops-core-patterns|Ops-Core Patterns]] - Detailed pattern documentation
- [[references/infrastructure/ci-cd-patterns|CI/CD Patterns]] - GitHub Actions patterns
