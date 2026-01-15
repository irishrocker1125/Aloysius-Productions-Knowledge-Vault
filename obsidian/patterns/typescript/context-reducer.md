---
title: "Context + Reducer Pattern"
created: 2026-01-15
type: pattern
language: typescript
reusable: true
source_project: gtd
tags:
  - pattern
  - typescript
  - react
  - state-management
---

# Context + Reducer Pattern

Predictable state management for React applications without external libraries.

## Problem

Complex React applications need shared state across many components. Props drilling becomes unwieldy, but full state management libraries add complexity.

## Solution

Combine React Context with useReducer for predictable state updates:

```typescript
import { createContext, useContext, useReducer, ReactNode } from 'react';

// 1. Define state shape
interface AppState {
  items: Item[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

const initialState: AppState = {
  items: [],
  filter: 'all',
  loading: false
};

// 2. Define actions with discriminated unions
type AppAction =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_FILTER'; payload: AppState['filter'] }
  | { type: 'SET_LOADING'; payload: boolean };

// 3. Create reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// 4. Create context
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

// 5. Create provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// 6. Create hook for consuming
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

## Usage

### In Components

```typescript
function ItemList() {
  const { state, dispatch } = useApp();

  const filteredItems = state.items.filter(item => {
    if (state.filter === 'all') return true;
    if (state.filter === 'active') return !item.completed;
    return item.completed;
  });

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>
          {item.title}
          <button
            onClick={() =>
              dispatch({ type: 'REMOVE_ITEM', payload: item.id })
            }
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Action Creators (Optional)

```typescript
// For complex actions, create helper functions
const actions = {
  addItem: (item: Item): AppAction => ({
    type: 'ADD_ITEM',
    payload: item
  }),

  removeItem: (id: string): AppAction => ({
    type: 'REMOVE_ITEM',
    payload: id
  })
};

// Usage
dispatch(actions.addItem(newItem));
```

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';

describe('AppContext', () => {
  it('adds items', () => {
    const { result } = renderHook(() => useApp(), {
      wrapper: AppProvider
    });

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        payload: { id: '1', title: 'Test' }
      });
    });

    expect(result.current.state.items).toHaveLength(1);
  });
});
```

## Trade-offs

### When to Use
- Medium complexity apps
- Shared state across 3+ components
- Need for predictable state updates
- Want to avoid external dependencies

### When NOT to Use
- Simple apps (useState is enough)
- Very complex apps (consider Zustand/Redux)
- Performance-critical with frequent updates

## Source

Pattern used in GTD and other React projects for manageable state.

## Related

- [[patterns/typescript/factory-di|Factory Pattern with DI]]
- [[references/testkitchen/typescript-conventions|TypeScript Conventions]]
