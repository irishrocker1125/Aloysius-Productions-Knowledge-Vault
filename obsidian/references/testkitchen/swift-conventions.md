---
created: 2026-01-13
type: reference
tags:
  - testkitchen
  - swift
  - swiftui
  - ios
  - conventions
---

# Swift/SwiftUI Conventions: Testkitchen Projects

Patterns and conventions from Poker (4,080 LOC), MadLibs (1,523 LOC), and QuestForge (2,253 LOC).

## File Organization

### Domain-Based Structure

```
ProjectName/
├── Models/          # Data types, business logic
├── Views/           # SwiftUI views
├── Components/      # Reusable UI components
├── Services/        # Storage, networking, utilities
├── Navigation/      # Navigation state and routes
├── Settings/        # User preferences
└── Data/            # Static data, templates
```

### MARK Sections

Consistent code organization within files:

```swift
// MARK: - Properties
// MARK: - Initialization
// MARK: - Body (for views)
// MARK: - Computed Properties
// MARK: - Methods
// MARK: - Helper Methods
// MARK: - Hashable/Equatable
// MARK: - Preview
```

## Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Classes/Structs | PascalCase, noun | `GameState`, `StoryTemplate`, `WordBank` |
| Protocols | PascalCase, -able/-ible | `Identifiable`, `Hashable`, `Codable` |
| Enums | PascalCase | `BettingRound`, `HandRank`, `WordType` |
| Properties | camelCase, noun | `currentPlayer`, `isHandInProgress` |
| Methods | camelCase, verb | `startNewHand()`, `processAction()` |
| Computed | camelCase, descriptive | `canAct`, `satisfiesRequirements` |

## Type Safety Patterns

### Comparable Enums with Raw Values

```swift
enum HandRank: Int, Comparable {
    case highCard = 0
    case onePair = 1
    case twoPair = 2
    // ...
    case royalFlush = 9

    static func < (lhs: HandRank, rhs: HandRank) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}
```

### Discriminated Enums (Sum Types)

```swift
enum StorySegment: Codable, Hashable {
    case text(String)
    case blank(WordType, hint: String?)
}
```

### Protocol Conformance

Standard conformances for model types:
- `Identifiable` - SwiftUI list support
- `Hashable` - Set membership, dictionary keys
- `Codable` - Persistence
- `Comparable` - Sorting, comparisons

## Validation Patterns

### Early Returns with Guard

```swift
func processAction(_ action: PlayerAction) -> Bool {
    guard currentPlayerIndex >= 0 && currentPlayerIndex < players.count else {
        return false
    }
    guard let player = currentPlayer, player.canAct else {
        return false
    }
    // Process action...
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

## UI Patterns

### ScaleButtonStyle (Tactile Feedback)

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

### Consistent Animation

Standard spring animation across projects:
- Response: 0.3 seconds
- Damping: 0.7

```swift
.animation(.spring(response: 0.3, dampingFraction: 0.7), value: someValue)
```

### Accessibility

```swift
Button(action: action) {
    // content
}
.accessibilityLabel("Start new game")
.accessibilityHint("Deals cards and begins a new round")
```

## Storage Patterns

### UserDefaults with Codable

```swift
@Observable
class StoryStorage {
    private static let storageKey = "completed_stories"
    var stories: [CompletedStory] = []

    init() {
        loadStories()
    }

    private func loadStories() {
        guard let data = UserDefaults.standard.data(forKey: Self.storageKey),
              let decoded = try? JSONDecoder().decode([CompletedStory].self, from: data)
        else { return }
        stories = decoded
    }

    private func persistStories() {
        guard let data = try? JSONEncoder().encode(stories) else { return }
        UserDefaults.standard.set(data, forKey: Self.storageKey)
    }
}
```

## Testing Conventions

### Test File Structure

```swift
import XCTest
@testable import ProjectName

final class HandEvaluatorTests: XCTestCase {

    // MARK: - Hand Rank Tests

    func testHandRankOrdering() {
        XCTAssertTrue(HandRank.highCard < HandRank.onePair)
        XCTAssertTrue(HandRank.onePair < HandRank.twoPair)
    }

    // MARK: - Edge Cases

    func testEmptyHand() {
        // ...
    }
}
```

### Preview Code

Every view should have a preview:

```swift
#Preview {
    CardView(card: Card(rank: .ace, suit: .spades))
}
```

## Code Quality Checklist

- [ ] Value types (structs) for data models
- [ ] Protocol conformance (Identifiable, Hashable, Codable)
- [ ] MARK sections for organization
- [ ] Guard statements for validation
- [ ] Computed properties for derived state
- [ ] @Published only for necessary properties
- [ ] Accessibility labels on interactive elements
- [ ] Preview blocks for all views

## Related

- [[architecture-patterns]] - MVVM and state management
- [[testing-practices]] - TDD workflow
- [[gas-framework-guide]] - Planning system
