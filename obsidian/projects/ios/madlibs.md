---
title: "MadLibs"
created: 2026-01-15
updated: 2026-01-15
type: project
project: madlibs
platform: ios
version: v1.0
status: shipped
tags:
  - project
  - ios
  - swift
  - swiftui
  - game
source: "MadLibs/.management/knowledge.md"
---

# MadLibs

A word game app for iOS with two play modes: Classic (fill-in-the-blank) and Creative (mix-and-match story generation).

## Key Decisions

| Decision                              | Rationale                                              | Outcome |
| ------------------------------------- | ------------------------------------------------------ | ------- |
| Two separate play modes               | User wants distinct Classic and Creative experiences   | Good    |
| Template + mix-and-match for Creative | Achieves dynamic feel without AI/network               | Good    |
| SwiftUI only                          | Modern, declarative, user preference                   | Good    |
| iOS 17.0 deployment target            | Modern SwiftUI features (@Observable, NavigationStack) | Good    |
| State-driven view switching           | Simpler than navigation for contained flow             | Good    |
| [WordType: [String]] for word bank    | Multiple words per type for creative story generation  | Good    |
| generateStory as static on WordBank   | Keeps generation near word source                      | Good    |
| ScaleButtonStyle at 0.97              | Subtle but noticeable press feedback                   | Good    |
| Accent color for filled words         | Clean inline styling without background                | Good    |

## Patterns Established

| Pattern                        | Description                              | Reusable |
| ------------------------------ | ---------------------------------------- | -------- |
| Two-mode game design           | Separate experiences sharing core models | Yes      |
| Word bank with type dictionary | Multiple words per category              | Yes      |
| State-driven view switching    | Enum-based view selection                | Yes      |
| ScaleButtonStyle               | Subtle press animation feedback          | Yes      |

## Lessons Learned

| Lesson                          | Impact                                 | Recommendation               |
| ------------------------------- | -------------------------------------- | ---------------------------- |
| @Observable simplifies state    | Less boilerplate than ObservableObject | Use iOS 17+ for new projects |
| Template generation is flexible | Dynamic stories without AI complexity  | Consider templates before AI |

## Related

- [[patterns/swift/observable-state|Observable State Patterns]]
- [[references/testkitchen/swift-conventions|Swift Conventions]]
