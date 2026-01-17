---
title: "Eliza"
created: 2026-01-15
updated: 2026-01-15
type: project
project: eliza
platform: web
version: v1.0
status: shipped
tags:
  - project
  - web
  - typescript
  - nodejs
  - chatbot
source: "Eliza/.management/knowledge.md"
---

# Eliza

A pattern-matching chatbot inspired by the original ELIZA program. Implements rule-based conversation with topic memory and response history.

## Key Decisions

| Decision                      | Rationale                                                    | Outcome |
| ----------------------------- | ------------------------------------------------------------ | ------- |
| CLI first, web second         | Faster iteration on core logic before UI complexity          | Good    |
| Pattern matching over AI      | Learning project focused on understanding rule-based systems | Good    |
| ESM modules over CommonJS     | Cleaner imports, modern JavaScript standards                 | Good    |
| TypeScript strict mode        | Type safety, better IDE tooling, fewer runtime errors        | Good    |
| First-match-wins rules        | Simple, predictable pattern matching behavior                | Good    |
| TopicMemory class pattern     | Consistent state tracking approach across conversation       | Good    |
| ResponseHistory class pattern | Prevents repetitive responses, cycles through all options    | Good    |
| Express.js for web API        | Minimal setup, familiar patterns, good TypeScript support    | Good    |

## Patterns Established

| Pattern                             | Description                                        | Reusable |
| ----------------------------------- | -------------------------------------------------- | -------- |
| ESM module separation               | engine/rules/cli separation for clean architecture | Yes      |
| Pattern matcher with capture groups | Input parsing with $N substitution                 | Yes      |
| Conversation state machine          | greeting → main → goodbye flow                     | Yes      |
| REPL interface pattern              | readline-based CLI prompt-response loop            | Yes      |
| Topic memory pattern                | Track user topics with random reference            | Maybe    |

## Lessons Learned

| Lesson                              | Impact                                  | Recommendation                               |
| ----------------------------------- | --------------------------------------- | -------------------------------------------- |
| TypeScript catches errors early     | Reduced debugging time significantly    | Always use strict mode for learning projects |
| Small phases are easier to verify   | Each phase took 3-10 minutes            | Keep phases focused on single concerns       |
| Pattern order matters               | First-match-wins needs careful ordering | Document pattern priority in rules files     |
| Web interface was trivial after CLI | Core logic was already solid            | Build core features CLI-first when possible  |

## Technical Debt

| Item                               | Priority | Notes                                        |
| ---------------------------------- | -------- | -------------------------------------------- |
| No persistent conversation history | Low      | By design for v1.0, could add later          |
| Rules hardcoded in module          | Low      | Could externalize to JSON for easier editing |

## Related

- [[patterns/typescript/factory-di|Factory Pattern with DI]]
- [[references/testkitchen/typescript-conventions|TypeScript Conventions]]
