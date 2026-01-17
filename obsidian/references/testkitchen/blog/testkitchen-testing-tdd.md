---
title: "TDD That Actually Speeds You Up: Testing Patterns from 10K Lines of Code"
slug: "testkitchen-testing-tdd"
status: draft
created: 2026-01-13
modified: 2026-01-13
published: null
author: "Aloysius Productions"
tags:
  - testing
  - tdd
  - swift
  - typescript
  - best-practices
categories:
  - Testing
  - Best Practices
seo:
  description: "How test-driven development actually made shipping faster. Practical TDD patterns from building iOS and TypeScript apps."
  keywords:
    - tdd
    - test driven development
    - swift testing
    - typescript testing
    - unit testing patterns
featured_image: null
wordpress_id: null
series: "Building Apps in Public"
series_order: 4
---

## TL;DR

TDD made me faster, not slower. The key: test behavior (not implementation), inject dependencies for determinism, and write tests first for complex logic. Here's what that looked like across 5 shipped projects.

---

## Introduction

I was skeptical of TDD. Write tests before the code exists? Sounds like extra work.

Then I tried it on Poker's hand evaluation logic. 50+ edge cases. Kickers, ties, split pots. The kind of complexity where bugs hide.

Tests first changed everything.

---

## The RED-GREEN-REFACTOR Cycle

### The Process

```
1. RED    - Write a failing test
2. GREEN  - Write minimum code to pass
3. REFACTOR - Clean up without changing behavior
```

### In Practice (Poker)

```bash
# Commit 1: RED
test: add failing test for flush detection

# Commit 2: GREEN
feat: implement flush detection

# Commit 3: REFACTOR
refactor: extract card suit grouping helper
```

Each commit is atomic. Each can be reverted independently. The git history tells a story.

---

## When TDD Helps Most

### Complex Logic

Hand evaluation has 50+ test cases:

```swift
func testFlushBeatsStrait() {
    let flush = makeHand(.flush, highCard: .king)
    let straight = makeHand(.straight, highCard: .ace)
    XCTAssertTrue(flush > straight)
}

func testFlushWithHigherKickerWins() {
    let flushA = makeHand(.flush, kickers: [.ace, .king, .queen, .jack, .nine])
    let flushB = makeHand(.flush, kickers: [.ace, .king, .queen, .jack, .eight])
    XCTAssertTrue(flushA > flushB)
}
```

Without tests, this logic would have shipped with bugs. Guaranteed.

### Edge Cases

```swift
func testSplitPotWithIdenticalHands() {
    let hand1 = evaluate([ace, king, queen, jack, ten].map { hearts($0) })
    let hand2 = evaluate([ace, king, queen, jack, ten].map { spades($0) })
    XCTAssertEqual(hand1, hand2)  // Royal flushes are equal regardless of suit
}
```

I didn't think of this case until I wrote the tests.

---

## When TDD Helps Less

### UI Code

Don't TDD SwiftUI views. Instead:

- Test the ViewModel
- Use previews for visual verification
- Integration test critical flows

### Simple CRUD

If you're just passing data through, skip the ceremony.

---

## Deterministic Testing

### The Problem

```typescript
// This test is flaky
it("should select a random response", () => {
  const engine = createEngine(persona);
  const response = engine.process("hello");
  expect(responses).toContain(response); // Always passes, proves nothing
});
```

### The Solution

Inject the randomness:

```typescript
function makeRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

it("should select first response when rng returns 0", () => {
  const engine = createEngine(persona, { rng: makeRng([0]) });
  expect(engine.process("hello")).toBe(responses[0]);
});

it("should select last response when rng returns 0.99", () => {
  const engine = createEngine(persona, { rng: makeRng([0.99]) });
  expect(engine.process("hello")).toBe(responses[responses.length - 1]);
});
```

Now the tests are deterministic and actually verify behavior.

---

## Test Helpers

### Swift

```swift
// Factory for test hands
func makeHand(_ rank: HandRank, highCard: Rank = .ace) -> EvaluatedHand {
    // Returns a hand with the specified rank
}

// Factory for specific cards
func hearts(_ rank: Rank) -> Card {
    Card(rank: rank, suit: .hearts)
}
```

### TypeScript

```typescript
// Factory for test personas
function makePersona(rules: Rule[]): Persona {
  return {
    name: "test",
    rules,
    greeting: "Hello",
    goodbye: "Goodbye",
  };
}
```

Helpers make tests readable and reduce duplication.

---

## Test Organization

### File Structure

```
# Swift
Tests/
└── ProjectTests/
    ├── HandEvaluatorTests.swift
    ├── BettingRoundTests.swift
    └── ShowdownTests.swift

# TypeScript
tests/
├── engine.test.ts
├── rules.test.ts
└── helpers/
    └── factories.ts
```

### Within Files

```swift
final class HandEvaluatorTests: XCTestCase {

    // MARK: - Hand Rank Tests

    func testHandRankOrdering() { ... }

    // MARK: - Flush Tests

    func testFlushDetection() { ... }

    // MARK: - Edge Cases

    func testEmptyHand() { ... }
}
```

Group related tests with MARK sections.

---

## What to Test

### Test This

1. **Business logic** - Hand evaluation, pattern matching, state transitions
2. **Edge cases** - Empty inputs, boundaries, invalid states
3. **Regressions** - Bugs that were found and fixed

### Skip This

1. **Framework behavior** - SwiftUI rendering, React lifecycle
2. **Simple getters** - If it's trivial, don't test it
3. **Third-party code** - Trust your dependencies

---

## The Velocity Impact

### Before TDD

1. Write code
2. Manually test
3. Find bug
4. Debug
5. Fix
6. Manually test again
7. Find another bug
8. Repeat

### After TDD

1. Write failing test
2. Write code
3. Test passes
4. Done

The upfront investment pays off immediately for complex logic.

---

## Practical Advice

### Start Small

Don't try to TDD everything. Start with:

- Complex calculations
- State machines
- Input validation

### Write Tests You Trust

If you don't trust the test, you'll ignore it. Make tests:

- Fast (run in milliseconds)
- Isolated (no shared state)
- Readable (intent is clear)

### Don't Over-Mock

```typescript
// Too much mocking
it("should call service", () => {
  const mockService = jest.fn();
  component.doThing(mockService);
  expect(mockService).toHaveBeenCalled(); // Tests nothing useful
});

// Better: test actual behavior
it("should return transformed data", () => {
  const result = transform(inputData);
  expect(result).toEqual(expectedOutput);
});
```

---

## Tools

### Swift

- **XCTest** - Built-in, fast, reliable
- **Code Coverage** - Xcode's built-in coverage

### TypeScript

- **Vitest** - Fast, ESM-native, great DX
- **Testing Library** - For React components

---

## Coming Up

Final post: The GAS framework—the planning system that enabled 51 plans at 1.6 hours average.

---

_This post is part of the "Building Apps in Public" series. See the [overview](/blog/testkitchen-overview-10k-lines) for context._
