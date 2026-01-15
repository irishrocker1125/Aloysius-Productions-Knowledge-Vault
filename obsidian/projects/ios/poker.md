---
title: "Poker"
created: 2026-01-15
updated: 2026-01-15
type: project
project: poker
platform: ios
version: v1.1
status: shipped
tags:
  - project
  - ios
  - swift
  - swiftui
  - game
source: "Poker/.management/knowledge.md"
---

# Poker

A Texas Hold'em poker game for iOS with AI opponents. Features hand evaluation, betting rounds, and intelligent AI decision-making.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Value types for models | Predictable state, easy testing | Good |
| Single GameState class | Centralized state for SwiftUI binding | Good |
| No external dependencies | Simplicity, no package management | Good |
| HandRank Int rawValue | Natural Comparable ordering | Good |
| Cards in significance order | Correct hand comparison (triplet before pair) | Good |
| determineWinners returns array | Split pot support | Good |
| hasActedThisRound on Player | Preflop big blind option handling | Good |
| Remainder chips to first winner | Arbitrary but consistent | Good |
| HandStrength enum (weak/medium/strong) | Simple AI decision categories | Good |
| 0.7s AI turn delay | Visual feedback without feeling slow | Good |
| Human at index 0 | Consistent bottom position | Good |
| Zero/negative raises rejected | Validation at processAction level | Good |
| minRaise = currentBet + bigBlind | Ensures valid minimum raise | Good |
| AI all-in when raise > chips | Chip-aware betting decisions | Good |

## Code Conventions

- PascalCase for all Swift files (`Card.swift`, `GameState.swift`)
- One primary type per file
- File name matches primary type name
- PascalCase for structs, classes, enums, protocols
- camelCase for all functions and methods
- Verb phrases for actions: `shuffle()`, `draw()`, `bet()`, `fold()`
- Query-style for computed properties: `isActive`, `canAct`, `isEmpty`

## Patterns Established

| Pattern | Description | Reusable |
|---------|-------------|----------|
| Value types for game models | Cards, Hands as structs | Yes |
| Centralized GameState | Single source of truth for SwiftUI | Yes |
| Hand evaluation algorithm | Poker hand ranking logic | Maybe |
| AI decision engine | Strength-based betting decisions | Maybe |

## Related

- [[patterns/swift/observable-state|Observable State Patterns]]
- [[references/testkitchen/swift-conventions|Swift Conventions]]
