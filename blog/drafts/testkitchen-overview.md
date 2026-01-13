---
title: "Building Apps in Public: 10,000 Lines of Code Across 8 Projects"
slug: "testkitchen-overview-10k-lines"
status: draft
created: 2026-01-13
modified: 2026-01-13
published: null
author: "Aloysius Productions"
tags:
  - testkitchen
  - indie-dev
  - learning-in-public
  - ios
  - typescript
categories:
  - Development
  - Case Study
seo:
  description: "A look inside the testkitchen: 8 app projects, 10,349 lines of code, and the patterns that emerged from building in public."
  keywords:
    - indie development
    - learning in public
    - ios development
    - typescript projects
    - app development journey
featured_image: null
wordpress_id: null
series: "Building Apps in Public"
series_order: 1
---

## TL;DR

Over the past months, I've built 8 distinct apps across iOS and TypeScript, totaling ~10,349 lines of code. This series documents what I learned: the patterns that worked, the mistakes I made, and the system that enabled shipping 5 projects to v1.0+.

---

## Introduction

This is the first post in a series about building apps in public. Not the polished, everything-went-smoothly version—the real one, with the detours, rewrites, and hard-won lessons.

The "testkitchen" started as a place to experiment. Build small things. Learn by doing. What emerged was a collection of projects that taught me more about software development than any tutorial could.

---

## The Projects

### Completed (5)

| Project | Platform | LOC | What It Does |
|---------|----------|-----|--------------|
| **Poker** | iOS/SwiftUI | 4,080 | Texas Hold'em against AI opponents |
| **Eliza** | Node.js/Web | 1,523 | Pattern-matching chatbot with personas |
| **GTD Inbox** | React | 970 | Frictionless thought capture |
| **MadLibs** | iOS/SwiftUI | 1,523 | Word game with two play modes |
| **QuestForge** | iOS/SwiftUI | 2,253 | Choice-driven narrative game |

### In Progress (3)

- **CardRoom** - React Native card game platform
- **ElizaPersonal** - Personal assistant variant
- **Walkie-Talkie** - Voice communication app

---

## What This Series Covers

1. **This post**: Overview and project summary
2. **Swift/SwiftUI Patterns**: iOS conventions that scaled
3. **TypeScript Patterns**: Web/Node conventions that worked
4. **Testing & TDD**: How test-first development changed everything
5. **The GAS Framework**: The planning system behind 1.6-hour deliveries

---

## Key Numbers

- **10,349** total lines of code
- **51** execution plans completed
- **1.6 hours** average time per plan
- **5** projects shipped to v1.0 or beyond
- **18** key architectural decisions documented

---

## The Unexpected Lesson

The most valuable thing I learned wasn't a specific pattern or technique. It was this:

**Small, scoped deliverables beat ambitious plans every time.**

The projects that shipped fastest weren't the simplest. They were the ones where I broke work into independent, testable pieces. Each piece delivered value. Each could be verified before moving on.

The projects that stalled? The ones where I tried to do too much at once.

---

## Coming Up Next

In the next post, I'll dive into the iOS/SwiftUI patterns that emerged across Poker, MadLibs, and QuestForge. We'll look at:

- MVVM vs @Observable (and when to use each)
- Value types that prevent bugs
- Animation patterns for consistent UX
- The button style that every project uses

---

## Follow Along

This series will publish weekly. Each post builds on the last, but you can jump to specific topics:

- [Swift/SwiftUI Patterns](/blog/testkitchen-swift-patterns) (coming soon)
- [TypeScript Patterns](/blog/testkitchen-typescript-patterns) (coming soon)
- [Testing & TDD](/blog/testkitchen-testing-tdd) (coming soon)
- [The GAS Framework](/blog/testkitchen-gas-framework) (coming soon)

---

*This post is part of the "Building Apps in Public" series documenting lessons from the testkitchen projects.*
