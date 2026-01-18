---
title: "Data Integrity Patterns"
created: 2026-01-18
updated: 2026-01-18
type: reference
tags:
  - infrastructure
  - data-integrity
  - validation
  - quality-assurance
---

# Data Integrity Patterns

Patterns for maintaining data consistency and preventing drift in knowledge systems.

## Cross-Reference Validation Pattern

Verify all internal links before adding or modifying content:

```markdown
## Before Adding a Link

1. Check target exists: `ls obsidian/path/to/target.md`
2. Verify frontmatter matches expected type
3. Add bidirectional link in target if appropriate
```

**When to Apply**: Every time you add a `[[wikilink]]` or markdown link to another page.

**Anti-pattern**: Creating links to pages that don't exist, expecting them to be created later.

## Single Source of Truth Pattern

Maintain one authoritative source for each piece of data:

| Data Type | Single Source | Consumers |
|-----------|---------------|-----------|
| Project status | `.management/knowledge.md` in each repo | project-status.md |
| Technical debt | Project `.management/knowledge.md` | technical-debt.md registry |
| Version info | Frontmatter in project page | Index pages, dashboards |
| Research outcomes | research/completed/*.md | Project pages |

**Sync Rule**: Aggregated views pull from sources; never manually edit aggregated data.

```bash
# Good: Sync from source
python scripts/sync-knowledge.py

# Bad: Manual edit in aggregated file
# This will be overwritten on next sync
```

## Stub Page Lifecycle Pattern

When a 404 is detected, follow this lifecycle instead of creating empty stubs:

```
┌─────────────────────────────────────────────────────┐
│ 1. 404 DETECTED                                     │
│    └─→ Check if page should exist                   │
│        ├─→ No: Remove the broken link               │
│        └─→ Yes: Continue to step 2                  │
├─────────────────────────────────────────────────────┤
│ 2. LOCATE SOURCE CONTENT                            │
│    └─→ Find authoritative source for this content   │
│        ├─→ Found: Create page with real content     │
│        └─→ Not found: Create as "draft" with TODO   │
├─────────────────────────────────────────────────────┤
│ 3. DRAFT PAGE (if source not found)                 │
│    status: draft                                    │
│    tags: [needs-content]                            │
│    Body: "TODO: Source content from X"              │
├─────────────────────────────────────────────────────┤
│ 4. REVIEW DRAFTS                                    │
│    Quarterly audit of all status: draft pages       │
│    Either populate or delete                        │
└─────────────────────────────────────────────────────┘
```

**Anti-pattern**: Creating stub pages with placeholder content like "Coming soon" or "TBD".

## Frontmatter Consistency Pattern

Required frontmatter fields by content type:

| Content Type | Required Fields |
|--------------|-----------------|
| project | title, created, updated, type, status, version |
| research | title, created, updated, type, status, outcome |
| reference | title, created, updated, type, tags |
| registry | title, created, updated, type, source |

**Validation Checks**:

1. `status` must be one of: `draft`, `active`, `completed`, `archived`
2. `version` must follow semver pattern: `v1.0`, `v0.3`
3. `updated` must be ≥ `created`
4. `source` for synced content must reference a valid path

## Quarterly Audit Checklist

Run this checklist every quarter:

- [ ] Run link validation: `npm run validate:links`
- [ ] Check for stale sync timestamps (>30 days)
- [ ] Verify project-status.md against source repos
- [ ] Review all `status: draft` pages
- [ ] Check for orphaned pages (no incoming links)
- [ ] Validate frontmatter consistency
- [ ] Update index pages if projects added/removed

## Best Practices

| Practice | Why |
|----------|-----|
| Validate before commit | Catch broken links early |
| Use source syncing | Prevents manual drift |
| Never create empty stubs | Better to fix the link |
| Quarterly audits | Catch accumulated drift |
| Bidirectional linking | Improves discoverability |

## Related

- [[research/completed/knowledge-vault-data-integrity-audit|Knowledge Vault Data Integrity Audit]]
- [[organization/synced/data-integrity-initiatives|Data Integrity Initiatives]]
- [[references/infrastructure/ops-core-patterns|Ops-Core Patterns]]
