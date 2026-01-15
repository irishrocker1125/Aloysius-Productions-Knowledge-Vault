---
title: "Factory Pattern with DI"
created: 2026-01-15
type: pattern
language: typescript
reusable: true
source_project: eliza
tags:
  - pattern
  - typescript
  - architecture
  - dependency-injection
---

# Factory Pattern with Dependency Injection

Creating objects with explicit dependencies for testability.

## Problem

Classes with implicit dependencies (global state, direct imports) are hard to test and modify. We need a way to make dependencies explicit and swappable.

## Solution

Use factory functions that accept dependencies as parameters:

```typescript
// Types for dependencies
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

interface Storage {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

// The service that needs dependencies
interface ChatEngine {
  process(input: string): string;
  getHistory(): string[];
}

// Factory function with explicit dependencies
function createChatEngine(deps: {
  logger: Logger;
  storage: Storage;
  rules: Rule[];
}): ChatEngine {
  const { logger, storage, rules } = deps;
  const history: string[] = [];

  return {
    process(input: string): string {
      logger.log(`Processing: ${input}`);
      history.push(input);

      for (const rule of rules) {
        if (rule.matches(input)) {
          const response = rule.apply(input);
          history.push(response);
          return response;
        }
      }

      return "I don't understand.";
    },

    getHistory(): string[] {
      return [...history];
    }
  };
}
```

## Usage

### Production

```typescript
import { consoleLogger } from './logger';
import { localStorageAdapter } from './storage';
import { defaultRules } from './rules';

const engine = createChatEngine({
  logger: consoleLogger,
  storage: localStorageAdapter,
  rules: defaultRules
});
```

### Testing

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('ChatEngine', () => {
  it('logs input when processing', () => {
    const mockLogger = {
      log: vi.fn(),
      error: vi.fn()
    };

    const engine = createChatEngine({
      logger: mockLogger,
      storage: { get: vi.fn(), set: vi.fn() },
      rules: []
    });

    engine.process('hello');

    expect(mockLogger.log).toHaveBeenCalledWith('Processing: hello');
  });
});
```

## Variations

### Partial Dependencies with Defaults

```typescript
interface EngineOptions {
  logger?: Logger;
  timeout?: number;
}

function createEngine(options: EngineOptions = {}) {
  const logger = options.logger ?? console;
  const timeout = options.timeout ?? 5000;
  // ...
}
```

### Class-Based Alternative

```typescript
class ChatEngine {
  constructor(
    private logger: Logger,
    private storage: Storage,
    private rules: Rule[]
  ) {}

  process(input: string): string {
    this.logger.log(`Processing: ${input}`);
    // ...
  }
}
```

## Trade-offs

### When to Use
- Services with multiple dependencies
- Code that needs unit testing
- Components that vary by environment

### When NOT to Use
- Simple utility functions
- Pure functions with no side effects
- One-off scripts

## Source

Extracted from [[projects/web/eliza|Eliza]] - Pattern matcher with injectable rules and state.

## Related

- [[patterns/typescript/context-reducer|Context + Reducer Pattern]]
- [[references/testkitchen/typescript-conventions|TypeScript Conventions]]
