---
title: "Observable State Patterns"
created: 2026-01-15
type: pattern
language: swift
reusable: true
source_project: poker, madlibs
tags:
  - pattern
  - swift
  - swiftui
  - state-management
---

# Observable State Patterns

SwiftUI state management using @Observable and @Published.

## Problem

SwiftUI views need to react to state changes. The framework provides multiple mechanisms (@State, @StateObject, @Observable) with different trade-offs.

## Solution: @Observable (iOS 17+)

The modern approach using the Observation framework:

```swift
import SwiftUI
import Observation

@Observable
class GameState {
    var score: Int = 0
    var isPlaying: Bool = false
    var currentRound: Int = 1

    func startGame() {
        isPlaying = true
        score = 0
        currentRound = 1
    }

    func nextRound() {
        currentRound += 1
    }
}

struct GameView: View {
    var state = GameState()

    var body: some View {
        VStack {
            Text("Score: \(state.score)")
            Text("Round: \(state.currentRound)")

            Button("Start") {
                state.startGame()
            }
        }
    }
}
```

## Alternative: @Published (iOS 13+)

For backwards compatibility with older iOS versions:

```swift
import SwiftUI
import Combine

class GameState: ObservableObject {
    @Published var score: Int = 0
    @Published var isPlaying: Bool = false
    @Published var currentRound: Int = 1

    func startGame() {
        isPlaying = true
        score = 0
        currentRound = 1
    }
}

struct GameView: View {
    @StateObject private var state = GameState()

    var body: some View {
        VStack {
            Text("Score: \(state.score)")
            Button("Start") {
                state.startGame()
            }
        }
    }
}
```

## Usage Patterns

### Centralized State

Single state object for the entire app/feature:

```swift
@Observable
class AppState {
    var user: User?
    var settings: Settings = Settings()
    var gameState: GameState?
}
```

### Computed Properties

Derived state that updates automatically:

```swift
@Observable
class PlayerState {
    var chips: Int = 1000
    var currentBet: Int = 0

    var availableChips: Int {
        chips - currentBet
    }

    var canBet: Bool {
        availableChips > 0
    }
}
```

## Trade-offs

### When to Use @Observable

- iOS 17+ target
- New projects
- Less boilerplate needed
- Automatic dependency tracking

### When to Use @Published

- iOS 13-16 support needed
- Existing ObservableObject codebases
- Need Combine integration

## Source

Extracted from:

- [[projects/ios/poker|Poker]] - GameState centralization
- [[projects/ios/madlibs|MadLibs]] - @Observable adoption

## Related

- [[patterns/swift/navigation-patterns|Navigation Patterns]]
- [[references/testkitchen/swift-conventions|Swift Conventions]]
