# Contributing Guide

Welcome to spoker's contributing guide! We appreciate your intention and time to contribute to this project 🙇.

## Getting Started

### Prerequisites

1. **Node.js**: v24.11.x (use `nvm` or `fnm` to manage versions)
2. **pnpm**: v10.24.0 (install via [corepack](https://pnpm.io/installation#using-corepack))
3. **Firebase Project**: Create your own Firebase project for local development
4. **Git**: Ensure you have Git configured

### Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/spoker.git
   cd spoker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` (if it exists) or create `.env.local`
   - Add your Firebase configuration (see README.md for required variables)

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Contribution Philosophy

- **Code quality over speed**: Maintain consistency with existing patterns
- **Type safety**: Leverage TypeScript to catch errors at compile time
- **Real-time first**: Consider Firebase Realtime Database synchronization implications
- **User experience**: Ensure changes work smoothly in collaborative scenarios

## Branching Strategy

- **`main`**: Production-ready code
- **`dev`**: Development branch (default for PRs)
- **Feature branches**: `feature/description` or `fix/description`

### Creating a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-description
```

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with Commitizen.

### Commit Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build config, etc.)
- `ci`: CI/CD changes

### Examples

```bash
feat(room): add task reordering in queue

fix(auth): handle email verification edge case

docs(readme): update installation instructions

refactor(store): simplify room state management
```

### Using Commitizen

```bash
# Interactive commit helper
pnpm commit
```

## Code Style and Formatting

### Biome Configuration

This project uses [Biome](https://biomejs.dev/) for linting and formatting (replaces ESLint and Prettier).

### Rules

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JavaScript/TypeScript
- **Semicolons**: Required
- **Array types**: Generic syntax (`Array<T>` not `T[]`)
- **No default exports**: Except for Next.js pages and config files

### Running Checks

```bash
# Check for issues
pnpm biome:check

# Auto-fix issues
pnpm biome:fix

# CI mode (strict)
pnpm biome:ci
```

### Common Patterns

#### Component Structure

```typescript
import { Component } from 'library';

import { useCustomHook } from '~/lib/hooks/custom-hook';
import { useStoreState } from '~/lib/stores/store';

export const MyComponent = () => {
  const { data } = useStoreState();
  const result = useCustomHook(data);

  return <Component>{result}</Component>;
};
```

#### Service Functions

```typescript
import { child, update } from 'firebase/database';

import { roomsData } from '~/lib/services/firebase/room/common';

export const updateSomething = async (roomId: string, data: DataType) => {
  await update(child(roomsData, `${roomId}/path`), data);
};
```

#### Type Definitions

```typescript
export interface MyType {
  field: string;
  optionalField?: number;
}

export type MyUnion = 'option1' | 'option2';
```

## Testing Expectations

Currently, the project does not have automated tests. When making changes:

1. **Manual testing**: Test your changes in a real Firebase environment
2. **Real-time sync**: Verify changes work correctly with multiple users
3. **Role permissions**: Test with different user roles (owner, participant, observant)
4. **Edge cases**: Consider disconnected users, concurrent updates, invalid states

### Testing Checklist

- [ ] Feature works as expected
- [ ] Real-time updates sync correctly
- [ ] Role-based permissions are enforced
- [ ] No console errors or warnings
- [ ] TypeScript compilation succeeds
- [ ] Biome checks pass
- [ ] Works across different browsers (Chrome, Firefox, Safari)

## Pull Request Process

### Before Submitting

1. **Update documentation**: If adding features, update relevant docs
2. **Run checks**: Ensure all checks pass:
   ```bash
   pnpm check:turbo
   ```
3. **Check for unused code**: Run `pnpm check:unused` and remove unused exports
4. **Test manually**: Verify functionality in development environment

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested the changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Criteria

PRs will be reviewed for:

- **Correctness**: Does it solve the problem?
- **Code quality**: Follows project conventions
- **Performance**: No unnecessary re-renders or Firebase operations
- **Security**: Firebase rules and auth checks are correct
- **User experience**: Changes improve or maintain UX

## Firebase Considerations

### Security Rules

- Security rules are generated from `src/lib/services/firebase/rules.ts`
- After modifying rules, run `pnpm generate-rules` to regenerate JSON
- Test rules in Firebase Console before deploying

### Real-time Updates

- Use `onValue` listeners for real-time data
- Implement `onDisconnect` handlers for user presence
- Consider race conditions with concurrent updates
- Use transactions (`runTransaction`) for critical updates if needed

### Data Structure

- Follow existing patterns in `src/lib/types/raw-db.ts`
- Maintain backward compatibility when possible
- Consider migration strategies for schema changes

## Common Pitfalls

### State Management

- **Don't**: Mutate Zustand state directly
- **Do**: Use setter functions from stores
- **Don't**: Create unnecessary subscriptions
- **Do**: Use `useShallow` to prevent unnecessary re-renders

### Firebase Operations

- **Don't**: Write to Firebase without error handling
- **Do**: Handle network errors and offline states
- **Don't**: Create listeners without cleanup
- **Do**: Unsubscribe in `useEffect` cleanup functions

### Type Safety

- **Don't**: Use `any` types
- **Do**: Define proper types in `src/lib/types/`
- **Don't**: Ignore TypeScript errors
- **Do**: Fix type errors before committing

## Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Code review**: Request review from maintainers

## Release Process

Releases are managed by maintainers using:

```bash
pnpm release  # Updates version and CHANGELOG.md
pnpm push-release  # Pushes tags to remote
```

Contributors should not manually update version numbers or CHANGELOG.md.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing to spoker! 🎉
