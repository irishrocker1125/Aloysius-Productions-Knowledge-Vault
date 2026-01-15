---
title: "Swift/SwiftUI Patterns That Actually Scale: Lessons from 7,800 Lines of iOS Code"
slug: "testkitchen-swift-patterns"
status: draft
created: 2026-01-13
modified: 2026-01-13
published: null
author: "Aloysius Productions"
tags:
  - swift
  - swiftui
  - ios
  - patterns
  - best-practices
categories:
  - iOS Development
  - Best Practices
seo:
  description: "Practical Swift/SwiftUI patterns from building 3 iOS apps. MVVM, value types, animations, and conventions that scale."
  keywords:
    - swiftui patterns
    - swift best practices
    - ios architecture
    - mvvm swiftui
    - observable pattern
featured_image: null
wordpress_id: null
series: "Building Apps in Public"
series_order: 2
---

## TL;DR

After building 3 iOS apps (Poker, MadLibs, QuestForge) totaling ~7,800 lines of Swift, here are the patterns that worked: MVVM with ObservableObject, value types for models, discriminated enums for state, and a consistent animation approach.

---

## Introduction

The testkitchen iOS projects weren't planned as a series. They evolved independently, each solving different problems. What's interesting is how similar patterns emerged across all three.

This post documents those patterns—not theoretical best practices, but conventions that survived real development.

---

## Architecture: MVVM, But Simple

### The Pattern

Every iOS project settled on the same structure:

```swift
// Single ObservableObject as ViewModel
class GameState: ObservableObject {
    @Published var players: [Player] = []
    @Published var pot: Int = 0

    // Computed properties for derived state
    var activePlayers: [Player] {
        players.filter { !$0.hasFolded && !$0.isAllIn }
    }
}
```

### Why It Works

1. **Single source of truth** - One object owns the state
2. **Computed properties** - Derived state is never stale
3. **Minimal @Published** - Only mark what actually triggers UI updates

### The iOS 17 Evolution

MadLibs used the newer `@Observable` macro:

```swift
@Observable
class AppNavigation {
    var path = NavigationPath()
    var currentRoute: Route = .home
}
```

**When to use which:**
- `ObservableObject` - Complex state with many subscribers
- `@Observable` - Simpler objects, iOS 17+ only

---

## Value Types: Structs Over Classes

### The Rule

**Models are structs. Period.**

```swift
struct Card: Identifiable, Hashable {
    let id = UUID()
    let rank: Rank
    let suit: Suit
}

struct Hand {
    private(set) var cards: [Card] = []

    mutating func add(_ card: Card) {
        guard cards.count < 2 else { return }  // Texas Hold'em
        cards.append(card)
    }
}
```

### Why It Matters

1. **Immutability by default** - Can't accidentally mutate shared state
2. **Copy semantics** - Each view gets its own copy
3. **Predictable behavior** - No reference shenanigans

### The Exception

ViewModels are classes (they need identity for observation).

---

## Enums: Your Secret Weapon

### Discriminated Unions

The most powerful Swift pattern:

```swift
enum StorySegment: Codable, Hashable {
    case text(String)
    case blank(WordType, hint: String?)
}
```

This single enum handles:
- Static story text
- Blanks with type requirements
- Optional hints
- Full Codable support for persistence

### State Machines

```swift
enum BettingRound: Int, Comparable {
    case preflop = 0
    case flop = 1
    case turn = 2
    case river = 3
    case showdown = 4

    var next: BettingRound? {
        BettingRound(rawValue: rawValue + 1)
    }
}
```

The `Int` raw value gives us:
- Natural ordering (Comparable for free)
- Easy progression (`next` computed property)
- Serialization if needed

---

## Validation: Guard Everything

### The Pattern

```swift
func processAction(_ action: PlayerAction) -> Bool {
    guard currentPlayerIndex >= 0 else { return false }
    guard currentPlayerIndex < players.count else { return false }
    guard let player = currentPlayer else { return false }
    guard player.canAct else { return false }

    // Now we know we're in a valid state
    // Process the action...
}
```

### Input Sanitization

```swift
mutating func add(word: String, for type: WordType) {
    let trimmed = word.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !trimmed.isEmpty else { return }
    words[type, default: []].append(trimmed)
}
```

Every external input gets:
1. Trimmed
2. Validated
3. Rejected or accepted

No exceptions.

---

## Animations: Consistency Wins

### The Standard Spring

Every project uses the same animation:

```swift
.animation(.spring(response: 0.3, dampingFraction: 0.7), value: someState)
```

Why these values?
- **0.3 response** - Quick but not jarring
- **0.7 damping** - Slight bounce, not rubbery

### The Button Style

MadLibs introduced this, and it's now standard:

```swift
struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.7),
                       value: configuration.isPressed)
    }
}
```

Subtle scale (0.97, not 0.9) provides tactile feedback without being distracting.

---

## File Organization

### The Structure That Scaled

```
ProjectName/
├── Models/          # Data types, business logic
├── Views/           # SwiftUI views
├── Components/      # Reusable UI pieces
├── Services/        # Storage, utilities
├── Navigation/      # Navigation state
└── ContentView.swift
```

### Code Organization

Every file uses MARK sections:

```swift
// MARK: - Properties
// MARK: - Initialization
// MARK: - Body
// MARK: - Methods
// MARK: - Preview
```

---

## Protocol Conformance Checklist

Every model type should consider:

- [ ] `Identifiable` - For SwiftUI lists and ForEach
- [ ] `Hashable` - For sets, dictionary keys, and NavigationPath
- [ ] `Codable` - For persistence
- [ ] `Comparable` - For sorting (if ordering matters)

---

## Lessons Learned

### What Worked

1. **Start with value types** - Classes only when you need identity
2. **Enums for state** - They catch impossible states at compile time
3. **Guard at boundaries** - Validate inputs, trust internals
4. **Consistent animation** - Users notice inconsistency more than quality

### What Didn't

1. **Deep view hierarchies** - Keep views flat
2. **Shared mutable state** - Always caused bugs
3. **Over-abstraction** - Three similar lines beat a premature helper

---

## Coming Up

Next post: TypeScript patterns from Eliza and GTD. Different language, surprisingly similar principles.

---

*This post is part of the "Building Apps in Public" series. See the [overview](/blog/testkitchen-overview-10k-lines) for context.*
