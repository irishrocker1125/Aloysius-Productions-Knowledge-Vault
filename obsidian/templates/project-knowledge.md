---
title: "{{title}}"
created: { { date } }
updated: { { date } }
type: project
project: { { project-name } }
platform: ios | web
version: v1.0
status: shipped | active | foundation
tags:
  - project
  - { { platform } }
  - { { technology } }
source: "{{project-path}}/.management/knowledge.md"
---

# {{title}}

Brief description of the project and its purpose.

## Key Decisions

| Decision   | Rationale                | Date       |
| ---------- | ------------------------ | ---------- |
| Decision 1 | Why this choice was made | YYYY-MM-DD |

## Patterns Established

| Pattern   | Description  | Reusable |
| --------- | ------------ | -------- |
| Pattern 1 | What it does | Yes/No   |

## Lessons Learned

| Lesson   | Context               | Impact                      |
| -------- | --------------------- | --------------------------- |
| Lesson 1 | When this was learned | How it changed our approach |

## Technical Debt

| Item      | Priority        | Notes              |
| --------- | --------------- | ------------------ |
| Debt item | High/Medium/Low | Additional context |

## Related

- [[patterns/...]] - Related patterns
- [[references/...]] - Related references
