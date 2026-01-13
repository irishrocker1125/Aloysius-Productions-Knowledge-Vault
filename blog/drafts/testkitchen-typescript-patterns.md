---
title: "TypeScript Patterns for Real Projects: Factory Functions, Discriminated Unions, and Security"
slug: "testkitchen-typescript-patterns"
status: draft
created: 2026-01-13
modified: 2026-01-13
published: null
author: "Aloysius Productions"
tags:
  - typescript
  - react
  - nodejs
  - patterns
  - best-practices
categories:
  - Web Development
  - Best Practices
seo:
  description: "TypeScript patterns from building Eliza and GTD: factory functions for testability, discriminated unions for type safety, and security at the boundaries."
  keywords:
    - typescript patterns
    - typescript best practices
    - factory pattern typescript
    - discriminated unions
    - react context patterns
featured_image: null
wordpress_id: null
series: "Building Apps in Public"
series_order: 3
---

## TL;DR

TypeScript patterns from building Eliza (chatbot) and GTD (inbox app): factory functions enable testing, discriminated unions catch bugs at compile time, and input validation at boundaries prevents security issues.

---

## Introduction

The Swift patterns from the previous post had an interesting parallel: many of the same principles applied to TypeScript, just with different syntax.

This post covers what worked for Eliza (1,523 LOC) and GTD (970 LOC)—two projects with different purposes but similar architectural needs.

---

## Factory Functions > Classes

### The Pattern

Instead of classes with constructors:

```typescript
// Don't do this
class Engine {
    private state: ConversationState = 'greeting';

    constructor(private persona: Persona) {}

    process(input: string): string {
        // Uses Math.random() internally - untestable!
    }
}
```

Do this:

```typescript
export function createEngine(
    persona?: Persona,
    options?: { rng?: () => number; responseStyle?: ResponseStyle }
): Engine {
    let state: ConversationState = 'greeting';
    const rng = options?.rng ?? Math.random;

    return {
        process: (input: string) => {
            // Uses injected rng - testable!
            const index = Math.floor(rng() * responses.length);
            return responses[index];
        },
        getState: () => state,
        reset: () => { state = 'greeting'; }
    };
}
```

### Why It Matters

1. **Testability** - Inject dependencies (like RNG) for deterministic tests
2. **Encapsulation** - Private state is truly private (closure, not `private` keyword)
3. **Flexibility** - Return type is the interface, not the implementation

### Test Example

```typescript
function makeRng(values: number[]): () => number {
    let i = 0;
    return () => values[i++ % values.length];
}

it('should select responses deterministically', () => {
    const engine = createEngine(persona, { rng: makeRng([0]) });
    // rng() always returns 0, so first response is always selected
    expect(engine.process('hello')).toBe(responses[0]);
});
```

---

## Discriminated Unions

### The Pattern

TypeScript's equivalent of Swift's associated value enums:

```typescript
export type InboxAction =
    | { type: 'LOAD'; items: InboxItem[] }
    | { type: 'ADD'; content: string }
    | { type: 'CATEGORIZE'; id: string; category: Category }
    | { type: 'SNOOZE'; id: string }
    | { type: 'DELETE'; id: string };
```

### Why It Works

The compiler ensures exhaustive handling:

```typescript
function inboxReducer(state: InboxState, action: InboxAction): InboxState {
    switch (action.type) {
        case 'LOAD':
            return { ...state, items: action.items, isLoaded: true };
        case 'ADD':
            return { ...state, items: [...state.items, createItem(action.content)] };
        case 'CATEGORIZE':
            // TypeScript knows action has 'id' and 'category' here
            return { ...state, items: categorize(state.items, action.id, action.category) };
        // If you forget a case, TypeScript errors
    }
}
```

### The Exhaustiveness Trick

Add a never check to catch missing cases:

```typescript
function assertNever(x: never): never {
    throw new Error(`Unexpected action: ${x}`);
}

// In reducer
default:
    return assertNever(action);  // Errors if any case is unhandled
```

---

## Context + Reducer for State

### The Pattern (GTD)

```typescript
interface InboxState {
    items: InboxItem[];
    isLoaded: boolean;
    saveError: boolean;
}

const InboxContext = createContext<{
    state: InboxState;
    dispatch: Dispatch<InboxAction>;
} | null>(null);

export function useInbox() {
    const context = useContext(InboxContext);
    if (!context) {
        throw new Error('useInbox must be used within InboxProvider');
    }
    return context;
}
```

### Why Not Redux?

For small apps, the React built-ins are enough:
- `useReducer` handles state transitions
- `useContext` provides global access
- No external dependencies

---

## Security at the Boundaries

### The Problem

User input can't be trusted. Ever.

### The Solution (Eliza)

Validate at the API boundary:

```typescript
const MAX_MESSAGE_LENGTH = 1000;
const repeatedChar = /(.)\1{500,}/;  // ReDoS protection

export function validateMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { message } = req.body;

    // Type check
    if (typeof message !== 'string') {
        return next(new AppError(400, 'Message must be a string'));
    }

    // Length check
    if (message.length > MAX_MESSAGE_LENGTH) {
        return next(new AppError(400, `Message too long`));
    }

    // Pattern check (ReDoS protection)
    if (repeatedChar.test(message)) {
        return next(new AppError(400, 'Suspicious input pattern'));
    }

    next();
}
```

### Structured Errors

```typescript
export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}
```

---

## Module Organization

### Barrel Exports

Each module exposes a clean API:

```typescript
// src/middleware/index.ts
export { validateMessage } from './validation';
export { errorHandler } from './errors';
export { securityHeaders } from './security';
```

### Public API

The root `index.ts` is the public interface:

```typescript
// src/index.ts
export { createEngine } from './engine';
export type { Engine, Persona, Rule } from './types';
export { classicPersona } from './personas';
```

Internal modules import from each other. External consumers import from the root.

---

## Type-First Imports

Separate type imports from value imports:

```typescript
import type { InboxItem, Category, InboxState } from '@/types';
import { createInboxItem, isProcessed } from '@/types';
```

Why?
- Clearer what's runtime vs compile-time
- Better tree-shaking potential
- Explicit about what's being imported

---

## ESM Configuration

### package.json

```json
{
    "type": "module"
}
```

### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true
    }
}
```

Modern JavaScript everywhere. No CommonJS compatibility hacks.

---

## Lessons Learned

### What Worked

1. **Factory functions** - Testability without class ceremony
2. **Discriminated unions** - Type-safe state machines
3. **Boundary validation** - Trust nothing from outside
4. **Barrel exports** - Clean module APIs

### What Didn't

1. **Over-typing** - Sometimes `string` is fine
2. **Deep type hierarchies** - Keep it flat
3. **Premature abstraction** - Three similar lines beat a generic helper

---

## Comparing to Swift

| Concept | Swift | TypeScript |
|---------|-------|------------|
| State container | ObservableObject | Context + Reducer |
| Associated enums | `enum case(Type)` | Discriminated unions |
| Immutability | structs | readonly + const |
| Validation | guard statements | Early returns |

Same principles, different syntax.

---

## Coming Up

Next: Testing and TDD practices that made shipping faster, not slower.

---

*This post is part of the "Building Apps in Public" series. See the [overview](/blog/testkitchen-overview-10k-lines) for context.*
