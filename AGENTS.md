# AI Agent Guidance

This document provides a mental model of the spoker codebase for AI IDE agents (Cursor, Antigravity, Zed, Windsurf) to reason accurately about structure, intent, and safe changes.

## Mental Model

Spoker is a **real-time collaborative planning poker application** built on:

- **Frontend**: Next.js (Pages Router) + React + Chakra UI
- **Backend**: Firebase Realtime Database (not Firestore)
- **State**: Zustand stores for client-side state
- **Real-time**: Firebase `onValue` listeners for live updates

### Core Architecture Pattern

```
User Action → React Component → Service Function → Firebase Write
                                                      ↓
Firebase Change → onValue Listener → Zustand Store → React Re-render
```

**Key insight**: The system is **eventually consistent**. Firebase writes are asynchronous, and real-time listeners update the UI. There is no server-side validation layer—security and validation happen in Firebase Realtime Database security rules.

## Module Responsibility Map

### `/src/lib/services/firebase/`

**Purpose**: Firebase operations layer. All database reads/writes go through here.

**Structure**:
- `auth/`: Authentication operations (login, logout, email verification)
- `room/`: Room CRUD and state updates
  - `create/`: Room creation
  - `get/`: Room fetching
  - `join/`: User joining rooms
  - `update/`: All room mutations (votes, tasks, config, etc.)

**Invariants**:
- Functions are **pure** (no side effects beyond Firebase)
- Functions return Promises
- Functions handle their own error cases (throw or return error states)
- **Never** mutate Firebase data directly from components

**Safe to modify**: ✅ Yes, but ensure Firebase rules are updated accordingly

**Risky changes**:
- Modifying data structures without updating `src/lib/types/raw-db.ts`
- Changing function signatures without updating callers
- Removing error handling

### `/src/lib/stores/`

**Purpose**: Client-side state management using Zustand.

**Files**:
- `auth.ts`: Current user and display name
- `room.ts`: Room state (data, users, voting state, loading)

**Pattern**:
```typescript
// State selectors (read-only)
useRoomStoreState() → { roomData, users, showVote, ... }

// Action selectors (write)
useRoomStoreAction() → { setRoomData, setUsers, ... }
```

**Invariants**:
- Stores use `useShallow` to prevent unnecessary re-renders
- State is **derived from Firebase**, not the source of truth
- Never mutate store state directly; use setter functions

**Safe to modify**: ⚠️ Caution—changes affect all components using the store

**Risky changes**:
- Changing state shape without updating all consumers
- Removing `useShallow` optimizations
- Adding synchronous state that should come from Firebase

### `/src/lib/pages/`

**Purpose**: Page-level components (not Next.js routes, but logical page components).

**Structure**:
- `hall/`: Room creation and joining interface
- `room/`: Main voting interface
  - `components/`: Room-specific UI components
  - `hooks/`: Room-specific hooks (`use-room-listener`, `use-vote-listener`)
- `home/`: Landing page

**Key hooks**:
- `use-room-listener.ts`: Sets up Firebase listener for room data, handles disconnects
- `use-vote-listener.ts`: Sets up listener for vote state changes

**Invariants**:
- Page components are **presentational**; business logic in services
- Hooks manage Firebase subscriptions and cleanup
- Components read from stores, call services for mutations

**Safe to modify**: ✅ Yes, but understand real-time implications

**Risky changes**:
- Removing Firebase listener cleanup (memory leaks)
- Modifying vote reveal logic without understanding `checkAllParticipantVoted`
- Changing role-based UI without updating permission checks

### `/src/lib/components/`

**Purpose**: Reusable UI components.

**Pattern**: Presentational components that accept props and callbacks.

**Safe to modify**: ✅ Generally safe

**Risky changes**:
- Changing component APIs without updating all usages
- Adding Firebase operations directly (should go through services)

### `/src/lib/constants/`

**Purpose**: Configuration constants and route definitions.

**Key files**:
- `routes/public.ts`: Public routes (no auth required)
- `routes/private.ts`: Private routes (auth required)
- `routes/restricted.ts`: Restricted routes (logged-out only)
- `hide-label.ts`: Vote hiding emoji options
- `allowed-values.ts`: Validation constants

**Safe to modify**: ✅ Generally safe, but route changes affect auth flow

### `/src/lib/types/`

**Purpose**: TypeScript type definitions.

**Key files**:
- `raw-db.ts`: Firebase database structure (`RoomInstance`, `Task`, `User`)
- `room.ts`: Room-related types (`RoomUser`, `pointOptions`)
- `user.ts`: User types (`RoleType`, `User`)

**Invariants**:
- Types must match Firebase data structure
- Types are used for validation (Zod schemas in `models/`)

**Safe to modify**: ⚠️ Changes must be reflected in Firebase rules and data

**Risky changes**:
- Changing `RoomInstance` structure without migration plan
- Modifying `RoleType` enum (affects role checks throughout codebase)

### `/src/lib/layout/`

**Purpose**: Application layout and routing logic.

**Key components**:
- `route-wrapper/`: Handles route protection and email verification
- `auth/`: Authentication UI (login, register, password reset)
- `header/`, `footer/`: Site-wide UI

**Invariants**:
- `RouteWrapper` enforces email verification for private routes
- Auth state drives route access decisions

**Safe to modify**: ⚠️ Route protection logic is critical

**Risky changes**:
- Modifying route protection without understanding auth flow
- Changing email verification requirements

### `/src/pages/`

**Purpose**: Next.js pages (routing layer).

**Pattern**: Thin wrappers that import page components from `/src/lib/pages/`.

**Safe to modify**: ✅ Generally safe, but route changes affect URLs

## Safe vs. Risky Areas

### ✅ Safe to Modify

1. **UI components** (`/src/lib/components/`): Styling, layout, presentational logic
2. **Page components** (`/src/lib/pages/*/index.tsx`): UI structure, conditional rendering
3. **Constants** (`/src/lib/constants/`): Configuration values, route lists
4. **Utilities** (`/src/lib/utils/`): Pure functions, helpers
5. **Styles** (`/src/lib/styles/`): Theme, colors, component styles

### ⚠️ Risky to Modify

1. **Firebase services** (`/src/lib/services/firebase/`): Data structure changes require rule updates
2. **Stores** (`/src/lib/stores/`): State shape changes affect all consumers
3. **Types** (`/src/lib/types/raw-db.ts`): Must match Firebase structure
4. **Firebase rules** (`/src/lib/services/firebase/rules.ts`): Security-critical
5. **Route protection** (`/src/lib/layout/components/route-wrapper/`): Auth flow
6. **Real-time listeners** (`/src/lib/pages/room/hooks/`): Subscription management

### 🚫 Do Not Modify Without Understanding

1. **Vote reveal logic** (`checkAllParticipantVoted` in `roomUtils.ts`): Complex business rule
2. **Finish vote sequence** (`submitVote`): Multi-step atomic operation
3. **User role checks** (`use-user-role.ts`): Permission system
4. **Firebase security rules**: Generated from TypeScript, but critical for security

## Files That Should Rarely Be Modified

1. **`src/lib/services/firebase/rules.ts`**: Security rules—understand implications before changing
2. **`src/lib/types/raw-db.ts`**: Core data model—changes require migration
3. **`src/lib/stores/room.ts`**: Central state—changes affect entire app
4. **`src/lib/utils/roomUtils.ts`**: Business logic utilities—test thoroughly

## How to Reason About Refactors

### Adding a New Feature

1. **Identify data changes**: Will this modify Firebase structure?
   - If yes: Update `raw-db.ts`, Firebase rules, and service functions
2. **Identify state changes**: Does this need new Zustand state?
   - If yes: Add to store, use `useShallow` for selectors
3. **Identify UI changes**: Where should this appear?
   - Create/update components, follow existing patterns
4. **Real-time implications**: Does this need live updates?
   - If yes: Add Firebase listener in appropriate hook

### Modifying Existing Features

1. **Trace data flow**: Component → Service → Firebase → Listener → Store → Component
2. **Check dependencies**: What components/hooks depend on this?
   - Use `grep` to find all usages
3. **Verify invariants**: Does change break any system invariants? (See SPEC.md)
4. **Test real-time**: Ensure changes work with multiple users simultaneously

### Removing Features

1. **Find all references**: Use `grep` to find imports and usages
2. **Check Firebase rules**: Remove validation for deleted fields
3. **Update types**: Remove from TypeScript definitions
4. **Clean up listeners**: Remove Firebase subscriptions if applicable

## Common Patterns

### Firebase Service Function Pattern

```typescript
import { child, update } from 'firebase/database';
import { roomsData } from '~/lib/services/firebase/room/common';

export const updateSomething = async (roomId: string, data: DataType) => {
  await update(child(roomsData, `${roomId}/path`), data);
};
```

**Key points**:
- Use `child()` to build paths
- Use appropriate Firebase method (`get`, `set`, `update`, `push`)
- Handle errors (currently many don't, but they should)

### Real-time Listener Pattern

```typescript
import { onValue } from 'firebase/database';
import { useEffect } from 'react';

export const useDataListener = (roomId: string) => {
  useEffect(() => {
    const unsubscribe = onValue(
      child(roomsData, roomId),
      (snap) => {
        if (snap.exists()) {
          setData(snap.val());
        }
      }
    );
    
    return () => unsubscribe(); // Cleanup
  }, [roomId]);
};
```

**Key points**:
- Always return cleanup function
- Check `snap.exists()` before using data
- Handle missing data gracefully

### Store Selector Pattern

```typescript
// Read state
const { roomData, users } = useRoomStoreState();

// Write state
const { setRoomData, setUsers } = useRoomStoreAction();
```

**Key points**:
- Separate read and write selectors
- Use `useShallow` internally to prevent re-renders
- Never mutate state directly

## Navigation Hints

### Finding Related Code

1. **Firebase operations**: Search for function name in `src/lib/services/firebase/`
2. **Component usage**: Search for component name across codebase
3. **Type definitions**: Check `src/lib/types/` for related types
4. **Constants**: Check `src/lib/constants/` for magic strings/numbers

### Understanding Data Flow

1. **User action**: Find component in `src/lib/pages/` or `src/lib/components/`
2. **Service call**: Find service function in `src/lib/services/firebase/`
3. **Firebase update**: Check `src/lib/services/firebase/rules.ts` for validation
4. **State update**: Find listener in `src/lib/pages/*/hooks/`
5. **UI update**: Find component using store state

## Known Pitfalls for Automated Edits

### 1. Firebase Path Construction

**Problem**: Hardcoded paths in multiple places
```typescript
// ❌ Bad: Hardcoded path
child(roomsData, `${roomId}/users/${uid}`)

// ✅ Better: Centralize path building (not currently done, but should be)
```

**Agent guidance**: When modifying paths, check all usages. Consider centralizing path builders.

### 2. Role Checks

**Problem**: Role checks scattered throughout codebase
```typescript
// Found in multiple components
if (isOwner) { ... }
if (isParticipant) { ... }
```

**Agent guidance**: When adding role-based logic, use `useUserRole()` hook. Don't duplicate role checks.

### 3. Vote Reveal Logic

**Problem**: Complex condition in `checkAllParticipantVoted()`
```typescript
// This logic is critical and non-obvious
users.filter(u => u.role === RoleType.participant)
  .every(u => (u.point ?? -1) >= 0) &&
users.length > 1 &&
!users.every(u => u.role === RoleType.owner);
```

**Agent guidance**: Do not modify this without understanding the business rule. Test with edge cases (all owners, single participant, etc.).

### 4. Type Safety

**Problem**: Some Firebase operations use `any` or loose types
```typescript
// Some places don't validate Firebase data shape
const data = snap.val(); // Could be anything
```

**Agent guidance**: When modifying Firebase reads, add type assertions or validation. Prefer types from `raw-db.ts`.

### 5. Concurrent Updates

**Problem**: No transaction support for multi-path updates
```typescript
// Finish vote does multiple writes sequentially
await updateRoomTask(...);
await rewriteQueue(...);
await rewriteCompleted(...);
await clearPoints(...);
```

**Agent guidance**: Be aware that these are not atomic. If modifying, consider error handling and rollback strategy.

## Suggested Prompts for AI Agents

### When Adding Features

```
I want to add [feature]. 
1. Identify which Firebase data structure needs to change
2. Update types in src/lib/types/raw-db.ts
3. Create/update service functions in src/lib/services/firebase/
4. Update Firebase rules if needed
5. Add UI components following existing patterns
6. Add real-time listeners if needed
```

### When Fixing Bugs

```
There's a bug where [description].
1. Trace the data flow from user action to Firebase and back
2. Identify where the logic breaks
3. Check if it's a real-time sync issue, state management issue, or business logic issue
4. Verify the fix doesn't break existing functionality
5. Consider edge cases (disconnections, concurrent updates, etc.)
```

### When Refactoring

```
I want to refactor [component/function/module].
1. Find all usages using grep
2. Understand dependencies and side effects
3. Verify the refactor maintains the same behavior
4. Check if Firebase rules or types need updates
5. Test with multiple users if it affects real-time behavior
```

## Cursor-Specific Notes

- **File organization**: Follow existing patterns (services, stores, components, pages)
- **Import paths**: Use `~/lib/` alias (configured in `tsconfig.json`)
- **Type safety**: Prefer explicit types over `any`
- **Real-time awareness**: Consider Firebase listener implications when suggesting changes

## Antigravity-Specific Notes

- **State management**: Zustand stores are the source of truth for UI state
- **Firebase operations**: Always go through service layer, never direct Firebase calls in components
- **Error handling**: Many service functions lack error handling—this is a known gap

## Zed-Specific Notes

- **Code navigation**: Use `grep` tool to find all usages before modifying
- **Type checking**: Run `pnpm type:check` after changes
- **Linting**: Run `pnpm biome:check` to ensure code style

## Windsurf-Specific Notes

- **Real-time sync**: Understand that Firebase updates are eventually consistent
- **Component updates**: Components re-render when Zustand state changes (via Firebase listeners)
- **Permission checks**: Always verify user role before allowing operations

## Testing Recommendations for Agents

When suggesting code changes, consider:

1. **Single user**: Does it work for one user?
2. **Multiple users**: Does it sync correctly across users?
3. **Role permissions**: Does it respect owner/participant/observant roles?
4. **Disconnections**: Does it handle user disconnects gracefully?
5. **Edge cases**: Empty rooms, all owners, single participant, etc.

## Summary

- **Data flows**: User → Component → Service → Firebase → Listener → Store → Component
- **State management**: Zustand stores, Firebase is source of truth
- **Real-time**: Firebase listeners update stores, components react to store changes
- **Security**: Firebase rules enforce permissions, client-side checks are UX only
- **Modifications**: Trace data flow, check dependencies, verify invariants, test real-time behavior

When in doubt, refer to SPEC.md for system invariants and expected behaviors.

