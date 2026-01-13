---
created: 2026-01-13
type: reference
tags:
  - testkitchen
  - typescript
  - react
  - conventions
---

# TypeScript/React Conventions: Testkitchen Projects

Patterns and conventions from Eliza (1,523 LOC) and GTD (970 LOC).

## Project Structure

### Modular Organization (Eliza)

```
src/
├── engine/         # Core business logic
├── middleware/     # Express.js middleware
├── rules/          # Domain-specific rules
├── personas/       # Configuration variants
├── cli/            # Command-line interface
├── persistence/    # Data storage layer
└── index.ts        # Public API exports
```

### React Application (GTD)

```
src/
├── components/     # React components (PascalCase.tsx)
├── context/        # React context providers
├── hooks/          # Custom hooks
├── types/          # TypeScript interfaces
├── persistence/    # Storage utilities
├── __tests__/      # Test files
└── App.tsx         # Root component
```

## Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Interfaces | PascalCase | `InboxItem`, `Rule`, `Engine` |
| Types | PascalCase | `InboxAction`, `Category`, `WordType` |
| Functions | camelCase | `createEngine`, `isProcessed`, `getPersona` |
| Constants | UPPER_SNAKE_CASE | `MAX_LENGTH`, `STORAGE_KEY` |
| Files (modules) | kebab-case | `inbox-context.ts`, `story-storage.ts` |
| Files (components) | PascalCase | `CaptureInput.tsx`, `InboxList.tsx` |

## Type Patterns

### Discriminated Unions

```typescript
export type InboxAction =
  | { type: 'LOAD'; items: InboxItem[] }
  | { type: 'ADD'; content: string }
  | { type: 'CATEGORIZE'; id: string; category: Category }
  | { type: 'SNOOZE'; id: string }
  | { type: 'DELETE'; id: string };

// Exhaustive handling in reducer
function inboxReducer(state: InboxState, action: InboxAction): InboxState {
  switch (action.type) {
    case 'LOAD': return { ...state, items: action.items };
    case 'ADD': return { ...state, items: [...state.items, createItem(action.content)] };
    // TypeScript ensures all cases are handled
  }
}
```

### Branded Types (State Machines)

```typescript
type ConversationState = 'greeting' | 'main' | 'goodbye';

interface Engine {
  getState(): ConversationState;
  process(input: string): string;
  reset(): void;
}
```

### Type-First Imports

```typescript
import type { InboxItem, Category } from '@/types';
import { isProcessed, createInboxItem } from '@/types';
```

## Export Patterns

### Barrel Exports

```typescript
// src/middleware/index.ts
export { validateMessage } from './validation';
export { errorHandler } from './errors';
export { securityHeaders } from './security';
export { sessionMiddleware } from './session';
```

### Public API (index.ts)

```typescript
// src/index.ts - Clean public API
export { createEngine } from './engine';
export type { Engine, Persona, Rule } from './types';
export { classicPersona, supportivePersona } from './personas';
```

## Module Patterns

### ESM Throughout

```json
// package.json
{
  "type": "module"
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Error Handling

### Structured Errors (Eliza)

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

// Usage in middleware
if (!isValidMessage(input)) {
  throw new AppError(400, 'Message must be a non-empty string');
}
```

### Error Boundaries (React)

```typescript
interface InboxState {
  items: InboxItem[];
  isLoaded: boolean;
  saveError: boolean;  // Track storage errors
}
```

## Security Patterns

### Input Validation (Eliza)

```typescript
const MAX_MESSAGE_LENGTH = 1000;
const repeatedChar = /(.)\1{500,}/;  // ReDoS protection

export function validateMessage(req: Request, res: Response, next: NextFunction) {
  const { message } = req.body;

  if (typeof message !== 'string') {
    return next(new AppError(400, 'Message must be a string'));
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return next(new AppError(400, `Message exceeds ${MAX_MESSAGE_LENGTH} characters`));
  }

  if (repeatedChar.test(message)) {
    return next(new AppError(400, 'Message contains suspicious patterns'));
  }

  next();
}
```

### Security Headers

```typescript
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
```

## React Patterns

### Custom Hooks

```typescript
export function useInbox() {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInbox must be used within InboxProvider');
  }
  return context;
}
```

### Memoization

```typescript
const unprocessedItems = useMemo(
  () => state.items.filter((item) => !isProcessed(item)),
  [state.items]
);

const handleAdd = useCallback((content: string) => {
  dispatch({ type: 'ADD', content });
}, [dispatch]);
```

## Testing Conventions

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',  // or 'jsdom' for React
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts']
    }
  }
});
```

### Test Helpers

```typescript
// Deterministic testing with injected RNG
function makeRng(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

// Factory for test personas
function makePersona(rules: Rule[]): Persona {
  return { name: 'test', rules, greeting: 'Hello' };
}
```

### Arrange-Act-Assert

```typescript
describe('createEngine', () => {
  it('should start in greeting state', () => {
    // Arrange
    const persona = makePersona([]);

    // Act
    const engine = createEngine(persona);

    // Assert
    expect(engine.getState()).toBe('greeting');
  });
});
```

## Code Quality Checklist

- [ ] Discriminated unions for action types
- [ ] Type-first imports separated from value imports
- [ ] Barrel exports for clean module APIs
- [ ] Path aliases configured (@/*)
- [ ] ESM module format throughout
- [ ] Input validation at boundaries
- [ ] Custom hooks for shared logic
- [ ] Memoization for expensive computations
- [ ] Test helpers extracted and reusable

## Related

- [[architecture-patterns]] - Factory and Context patterns
- [[testing-practices]] - TDD and deterministic testing
- [[gas-framework-guide]] - Planning system
