---
title: "Persistence Patterns"
created: 2026-01-15
type: pattern
language: swift
reusable: true
source_project: various
tags:
  - pattern
  - swift
  - persistence
  - storage
---

# Persistence Patterns

Data persistence approaches for iOS apps.

## Problem

Apps need to persist data across sessions. iOS provides UserDefaults, CoreData, and SwiftData with different complexity and capability trade-offs.

## Solution 1: UserDefaults (Simple State)

For small amounts of structured data:

```swift
@Observable
class SettingsManager {
    private let defaults = UserDefaults.standard

    var soundEnabled: Bool {
        get { defaults.bool(forKey: "soundEnabled") }
        set { defaults.set(newValue, forKey: "soundEnabled") }
    }

    var highScore: Int {
        get { defaults.integer(forKey: "highScore") }
        set { defaults.set(newValue, forKey: "highScore") }
    }
}
```

### With Codable Objects

```swift
struct GameProgress: Codable {
    var level: Int
    var score: Int
    var achievements: [String]
}

class ProgressManager {
    private let key = "gameProgress"

    func save(_ progress: GameProgress) {
        if let data = try? JSONEncoder().encode(progress) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    func load() -> GameProgress? {
        guard let data = UserDefaults.standard.data(forKey: key),
              let progress = try? JSONDecoder().decode(GameProgress.self, from: data) else {
            return nil
        }
        return progress
    }
}
```

## Solution 2: AppStorage (SwiftUI Integration)

For settings that directly bind to views:

```swift
struct SettingsView: View {
    @AppStorage("soundEnabled") private var soundEnabled = true
    @AppStorage("darkMode") private var darkMode = false
    @AppStorage("username") private var username = ""

    var body: some View {
        Form {
            Toggle("Sound", isOn: $soundEnabled)
            Toggle("Dark Mode", isOn: $darkMode)
            TextField("Username", text: $username)
        }
    }
}
```

## Solution 3: File-Based (Documents)

For larger data or custom formats:

```swift
class DocumentStorage {
    private let fileName = "gameData.json"

    private var fileURL: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent(fileName)
    }

    func save<T: Encodable>(_ data: T) throws {
        let encoded = try JSONEncoder().encode(data)
        try encoded.write(to: fileURL)
    }

    func load<T: Decodable>(_ type: T.Type) throws -> T {
        let data = try Data(contentsOf: fileURL)
        return try JSONDecoder().decode(type, from: data)
    }
}
```

## Trade-offs

### UserDefaults
- **Use when**: Small data, settings, preferences
- **Avoid when**: Large datasets, complex relationships
- **Limit**: ~1MB practical maximum

### AppStorage
- **Use when**: SwiftUI views need direct binding
- **Avoid when**: Complex data, non-view contexts

### File-Based
- **Use when**: Larger data, need portability
- **Avoid when**: Relational data, need queries

### CoreData/SwiftData
- **Use when**: Relational data, complex queries
- **Avoid when**: Simple key-value needs

## Design Decisions

### Session-Only State

Some apps intentionally don't persist (Quest-Forge):
- Sessions are short by design
- Reduces architecture complexity
- No save state bugs

### Incremental Saves

For games with frequent updates:
```swift
func processMove() {
    // Only save on significant events
    if gameState.isCheckpoint {
        saveProgress()
    }
}
```

## Source

Patterns used across iOS projects for appropriate persistence levels.

## Related

- [[patterns/swift/observable-state|Observable State Patterns]]
- [[references/testkitchen/swift-conventions|Swift Conventions]]
