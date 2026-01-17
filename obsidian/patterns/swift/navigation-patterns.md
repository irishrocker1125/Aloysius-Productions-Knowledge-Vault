---
title: "Navigation Patterns"
created: 2026-01-15
type: pattern
language: swift
reusable: true
source_project: quest-forge, madlibs
tags:
  - pattern
  - swift
  - swiftui
  - navigation
---

# Navigation Patterns

SwiftUI navigation approaches for different scenarios.

## Problem

SwiftUI provides multiple navigation mechanisms (NavigationStack, sheets, fullScreenCover). Choosing the right approach impacts UX and code complexity.

## Solution 1: NavigationStack (Hierarchical)

For drill-down navigation with back button:

```swift
struct ContentView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List {
                NavigationLink("Item 1", value: "item1")
                NavigationLink("Item 2", value: "item2")
            }
            .navigationDestination(for: String.self) { item in
                DetailView(item: item)
            }
        }
    }
}
```

## Solution 2: fullScreenCover (Immersive)

For modal experiences without navigation chrome:

```swift
struct MainMenuView: View {
    @State private var showGame = false

    var body: some View {
        VStack {
            Button("Play") {
                showGame = true
            }
        }
        .fullScreenCover(isPresented: $showGame) {
            GameView(onExit: { showGame = false })
        }
    }
}
```

## Solution 3: State-Driven Views

For contained flows with enum-based switching:

```swift
enum GamePhase {
    case menu
    case playing
    case result
}

struct GameContainer: View {
    @State private var phase: GamePhase = .menu

    var body: some View {
        switch phase {
        case .menu:
            MenuView(onStart: { phase = .playing })
        case .playing:
            PlayView(onComplete: { phase = .result })
        case .result:
            ResultView(onRestart: { phase = .menu })
        }
    }
}
```

## Usage Patterns

### Scene-Based Navigation (Quest-Forge)

```swift
struct StoryView: View {
    @State private var currentSceneId: String = "intro"
    let story: Story

    var body: some View {
        if let scene = story.scene(id: currentSceneId) {
            SceneView(scene: scene) { nextSceneId in
                withAnimation(.easeInOut(duration: 0.25)) {
                    currentSceneId = nextSceneId
                }
            }
        }
    }
}
```

### Two-Mode Selection (MadLibs)

```swift
enum PlayMode {
    case classic
    case creative
}

struct ModeSelectionView: View {
    var onSelect: (PlayMode) -> Void

    var body: some View {
        HStack {
            Button("Classic") { onSelect(.classic) }
            Button("Creative") { onSelect(.creative) }
        }
    }
}
```

## Trade-offs

### NavigationStack

- **Use when**: Hierarchical content, need back button
- **Avoid when**: Immersive experiences, game screens

### fullScreenCover

- **Use when**: Immersive modals, game screens
- **Avoid when**: Quick interactions, drill-down content

### State-Driven

- **Use when**: Simple flows, contained experiences
- **Avoid when**: Deep hierarchies, many destinations

## Source

Extracted from:

- [[projects/ios/quest-forge|Quest-Forge]] - fullScreenCover for game immersion
- [[projects/ios/madlibs|MadLibs]] - State-driven mode switching

## Related

- [[patterns/swift/observable-state|Observable State Patterns]]
- [[references/testkitchen/swift-conventions|Swift Conventions]]
