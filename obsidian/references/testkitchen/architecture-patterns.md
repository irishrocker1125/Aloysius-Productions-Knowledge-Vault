---
created: 2026-01-13
type: reference
tags:
  - testkitchen
  - architecture
  - best-practices
  - swift
  - typescript
---

# Architecture Patterns: Testkitchen Projects

Cross-platform architecture patterns discovered across 8 testkitchen projects (~10,349 LOC).

## iOS/SwiftUI Architecture

### MVVM with ObservableObject (Poker)

**Pattern:** Traditional MVVM with single source of truth

```swift
// GameState as ViewModel - single ObservableObject
class GameState: ObservableObject {
    @Published var players: [Player] = []
    @Published var currentPlayerIndex: Int = -1
    @Published var pot: Int = 0

    // Computed properties for derived state
    var isHandInProgress: Bool { ... }
    var activePlayers: [Player] { ... }
}
```

**Key Characteristics:**

- Single `@Published` properties for reactive UI binding
- Computed properties for derived state (no duplication)
- All game flow logic centralized in ViewModel
- Views are leaf components with minimal state

### @Observable Pattern (MadLibs - iOS 17+)

**Pattern:** Modern observation with NavigationStack

```swift
@Observable
class AppNavigation {
    var path = NavigationPath()
    var currentRoute: Route = .home
}

enum Route: Hashable {
    case home, classicMode, creativeMode, storyDisplay, history
}
```

**Key Characteristics:**

- Lightweight navigation object
- NavigationPath-based routing
- Enum-driven routes for type safety
- Storage services as separate @Observable classes

## TypeScript Architecture

### Factory Pattern with Dependency Injection (Eliza)

**Pattern:** Testable instance creation

```typescript
export function createEngine(
  persona?: Persona,
  options?: { rng?: () => number; responseStyle?: ResponseStyle }
): Engine {
  // Factory creates configured engine instance
  return {
    process: (input: string) => { ... },
    getState: () => currentState,
    reset: () => { ... }
  };
}
```

**Key Characteristics:**

- Accepts optional dependencies for testing
- Personas as config objects, not classes
- Deterministic testing via injected RNG
- Clean public API with minimal surface area

### Context + Reducer Pattern (GTD)

**Pattern:** Centralized state management

```typescript
export type InboxAction =
  | { type: "LOAD"; items: InboxItem[] }
  | { type: "ADD"; content: string }
  | { type: "CATEGORIZE"; id: string; category: Category }
  | { type: "SNOOZE"; id: string };

function inboxReducer(state: InboxState, action: InboxAction): InboxState {
  switch (action.type) {
    case "LOAD":
      return { ...state, items: action.items, isLoaded: true };
    case "ADD":
      return { ...state, items: [...state.items, createItem(action.content)] };
    // ...
  }
}
```

**Key Characteristics:**

- Discriminated unions for type-safe actions
- Custom hook (useInbox) exposes typed actions
- Reducer handles all state transitions
- Persistence layer isolated from UI

## Cross-Platform Principles

### Single Source of Truth

All projects follow this principle:

- **Poker:** GameState owns all game data
- **MadLibs:** AppNavigation + Storage services
- **Eliza:** Engine instance owns conversation state
- **GTD:** InboxContext owns item state

### Layered Architecture

Successful projects use foundation-first delivery:

```
1. Foundation (setup, infrastructure)
2. Core Engine (business logic)
3. Primary Interface (CLI/main UI)
4. Secondary Interface (web/additional views)
5. Features (extensions, polish)
```

### Value Types for Models

Both platforms use immutable value types:

- **Swift:** structs for Card, Hand, Player, WordBank
- **TypeScript:** readonly interfaces, factory functions

## Anti-Patterns Avoided

1. **No God Objects** - State split into focused units
2. **No Deep Inheritance** - Composition over inheritance
3. **No Shared Mutable State** - Value types prevent mutations
4. **No UI Logic in Models** - Clean separation of concerns

## Related

- [[swift-conventions]] - iOS/SwiftUI conventions
- [[typescript-conventions]] - TypeScript/React conventions
- [[testing-practices]] - TDD and testing approaches
