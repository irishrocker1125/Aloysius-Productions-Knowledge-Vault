---
title: "Quest-Forge"
created: 2026-01-15
updated: 2026-01-15
type: project
project: quest-forge
platform: ios
version: v1.0
status: shipped
tags:
  - project
  - ios
  - swift
  - swiftui
  - game
  - narrative
source: "Quest-Forge/.management/knowledge.md"
---

# Quest-Forge

A dark fantasy narrative game for iOS with choice-based gameplay, character selection, and branching storylines.

## Key Decisions

| Decision                           | Rationale                                              | Outcome                   |
| ---------------------------------- | ------------------------------------------------------ | ------------------------- |
| SwiftUI native                     | Clean stack matches iOS-only scope                     | Good                      |
| Choice-based input only            | Reduces complexity, maintains narrative flow           | Good                      |
| No save states in v1               | Simplifies architecture, sessions are short by design  | Good (revisiting in v1.1) |
| Dark fantasy primary tone          | Sets atmospheric foundation, can expand later          | Good                      |
| StoryScene naming                  | Avoid SwiftUI Scene collision                          | Good                      |
| Theme-prefixed colors              | Avoid Xcode asset symbol conflicts                     | Good                      |
| fullScreenCover for game/selection | Immersive experience without nav chrome                | Good                      |
| String IDs for scenes              | Human-readable story authoring                         | Good                      |
| Combine Timer.publish              | SwiftUI-compatible animations without retain cycles    | Good                      |
| 0.25s fade timing                  | Quick but visible scene transitions                    | Good                      |
| SampleStory.all pattern            | Enables iteration over all scenarios                   | Good                      |
| requiredCharacterIds on Choice     | Character-specific content without fragmenting stories | Good                      |
| Optional discoveries (pendant)     | Rewards exploration, affects later paths               | Good                      |
| Named NPCs (Lyra Shadowmend)       | Emotional weight to backstory reveals                  | Good                      |
| Genre-bending scenarios            | Heist + cosmic horror differentiates content           | Good                      |

## Patterns Established

| Pattern                       | Description                              | Reusable |
| ----------------------------- | ---------------------------------------- | -------- |
| String scene IDs              | Human-readable story graph navigation    | Yes      |
| Choice-based branching        | Simple but effective narrative structure | Yes      |
| Theme-prefixed assets         | Avoid Xcode symbol conflicts             | Yes      |
| fullScreenCover for immersion | Modal presentation for game screens      | Yes      |
| Timer-based animations        | Combine for SwiftUI-compatible timing    | Yes      |

## Lessons Learned

| Lesson                          | Impact                          | Recommendation                               |
| ------------------------------- | ------------------------------- | -------------------------------------------- |
| String IDs are human-friendly   | Story authoring is more natural | Use strings over UUIDs for narrative content |
| Prefix theme colors             | Xcode assets can conflict       | Always namespace asset names                 |
| Short sessions justify no saves | Reduced scope significantly     | Scope to session length early                |

## Related

- [[patterns/swift/navigation-patterns|Navigation Patterns]]
- [[references/testkitchen/swift-conventions|Swift Conventions]]
