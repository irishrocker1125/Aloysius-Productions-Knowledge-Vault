---
created: 2026-01-13
type: reference
tags:
  - testkitchen
  - testing
  - tdd
  - best-practices
---

# Testing Practices: Testkitchen Projects

TDD patterns and testing strategies from Poker, Eliza, GTD, MadLibs, and QuestForge.

## TDD Workflow

### RED-GREEN-REFACTOR Cycle

The testkitchen projects follow strict TDD with atomic commits:

```
1. RED    - Write failing test (commit: "test: add failing test for X")
2. GREEN  - Implement minimum code to pass (commit: "feat: implement X")
3. REFACTOR - Clean up without changing behavior (commit: "refactor: clean up X")
```

**Example from Poker:**
```bash
git log --oneline
abc1234 test: add failing hand comparison tests
def5678 feat: implement hand comparison logic
ghi9012 refactor: extract helper for card sorting
```

## Test Structure

### Swift/XCTest (iOS Projects)

```swift
import XCTest
@testable import Poker

final class HandEvaluatorTests: XCTestCase {

    // MARK: - Hand Rank Tests

    func testHandRankOrdering() {
        XCTAssertTrue(HandRank.highCard < HandRank.onePair)
        XCTAssertTrue(HandRank.onePair < HandRank.twoPair)
        XCTAssertTrue(HandRank.twoPair < HandRank.threeOfAKind)
    }

    func testEvaluateFlush() {
        let cards = [
            Card(rank: .ace, suit: .hearts),
            Card(rank: .king, suit: .hearts),
            Card(rank: .queen, suit: .hearts),
            Card(rank: .jack, suit: .hearts),
            Card(rank: .nine, suit: .hearts)
        ]
        let result = HandEvaluator.evaluate(cards)
        XCTAssertEqual(result.rank, .flush)
    }

    // MARK: - Edge Cases

    func testEmptyHandReturnsHighCard() {
        let result = HandEvaluator.evaluate([])
        XCTAssertEqual(result.rank, .highCard)
    }
}
```

### TypeScript/Vitest (TS Projects)

```typescript
import { describe, it, expect } from 'vitest';
import { createEngine } from '../src/engine';

describe('createEngine', () => {
  it('should start in greeting state', () => {
    const engine = createEngine();
    expect(engine.getState()).toBe('greeting');
  });

  it('should transition to main after greeting', () => {
    const engine = createEngine();
    engine.process('hello');
    expect(engine.getState()).toBe('main');
  });

  it('should use injected RNG for deterministic output', () => {
    const rng = makeRng([0, 0.5, 1]);
    const engine = createEngine(undefined, { rng });

    // First response uses rng() = 0, selecting first option
    const response1 = engine.process('test');
    // Deterministic based on injected values
  });
});
```

## Deterministic Testing

### Dependency Injection for RNG

**Problem:** Random behavior makes tests flaky.

**Solution:** Inject RNG function for deterministic testing.

```typescript
// Production: uses Math.random
const engine = createEngine();

// Testing: uses predictable sequence
function makeRng(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

const engine = createEngine(undefined, { rng: makeRng([0, 0.5, 1]) });
```

### Test Helpers

```typescript
// Factory for test personas
function makePersona(rules: Rule[]): Persona {
  return {
    name: 'test',
    rules,
    greeting: 'Hello',
    goodbye: 'Goodbye'
  };
}

// Reusable in all tests
it('should match rule pattern', () => {
  const persona = makePersona([
    { pattern: /hello/i, responses: ['Hi there!'] }
  ]);
  const engine = createEngine(persona);
  expect(engine.process('hello')).toBe('Hi there!');
});
```

## Test Categories

### Unit Tests (Model Layer)

Test pure business logic in isolation:

```swift
// MadLibs: WordBank tests
func testWordBankAddWord() {
    var wordBank = WordBank()
    wordBank.add(word: "cat", for: .noun)
    XCTAssertTrue(wordBank.words(for: .noun).contains("cat"))
}

func testWordBankTrimsWhitespace() {
    var wordBank = WordBank()
    wordBank.add(word: "  cat  ", for: .noun)
    XCTAssertTrue(wordBank.words(for: .noun).contains("cat"))
}
```

### Integration Tests (Flow Testing)

Test component interactions:

```typescript
// GTD: Context integration
describe('InboxContext', () => {
  it('should persist items to storage', async () => {
    const { result } = renderHook(() => useInbox(), {
      wrapper: InboxProvider
    });

    act(() => {
      result.current.addItem('Test task');
    });

    // Verify persistence
    const stored = await storage.load();
    expect(stored).toContainEqual(
      expect.objectContaining({ content: 'Test task' })
    );
  });
});
```

### Edge Case Tests

Explicitly test boundaries:

```swift
// Poker: Hand capacity validation
func testHandEnforcesMaxCards() {
    var hand = Hand()
    hand.add(Card(rank: .ace, suit: .spades))
    hand.add(Card(rank: .king, suit: .hearts))
    hand.add(Card(rank: .queen, suit: .clubs))  // Should be rejected
    XCTAssertEqual(hand.cards.count, 2)  // Texas Hold'em limit
}
```

## Test Organization

### File Naming

| Platform | Convention | Example |
|----------|------------|---------|
| Swift | `*Tests.swift` | `HandEvaluatorTests.swift` |
| TypeScript | `*.test.ts` | `engine.test.ts` |

### Test Location

```
# Swift (Xcode convention)
ProjectName/
├── Sources/
└── Tests/
    └── ProjectNameTests/
        ├── HandEvaluatorTests.swift
        └── BettingRoundTests.swift

# TypeScript
src/
├── engine/
└── __tests__/
    └── engine.test.ts
# or
tests/
└── engine.test.ts
```

## Coverage Strategy

### Focus Areas

1. **Business Logic** - Hand evaluation, pattern matching, state transitions
2. **Edge Cases** - Empty inputs, boundary values, invalid states
3. **Integration Points** - Storage, API responses, navigation

### What NOT to Test

- SwiftUI views (visual testing is better)
- Framework code
- Simple getters/setters
- Third-party library behavior

## Test Configuration

### Vitest (TypeScript)

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts', 'src/index.ts']
    }
  }
});
```

### XCTest (Swift)

Configured via Xcode scheme:
- Test parallelization enabled
- Code coverage collection enabled
- Randomized test order

## Best Practices Checklist

- [ ] Tests run in isolation (no shared state)
- [ ] Deterministic output (inject randomness)
- [ ] Descriptive test names (behavior, not implementation)
- [ ] ARRANGE-ACT-ASSERT structure
- [ ] Edge cases explicitly tested
- [ ] No tests for framework behavior
- [ ] Atomic commits (test → implement → refactor)
- [ ] Test helpers extracted and reusable

## Related

- [[architecture-patterns]] - Testable architecture
- [[swift-conventions]] - iOS testing patterns
- [[typescript-conventions]] - TypeScript testing patterns
- [[velocity-insights]] - TDD impact on delivery speed
