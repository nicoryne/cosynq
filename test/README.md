# Property-Based Testing for Supabase Roles JWT Hooks

This directory contains comprehensive property-based tests for the RBAC system using fast-check.

## Overview

The test suite validates 15 correctness properties defined in the design document:

1. **Database Integrity Constraints** - Unique constraints, cascade deletes, defaults
2. **JWT Hook Round-Trip Preservation** - Role injection into JWT claims
3. **Role-Based Access Control Enforcement** - RLS policy validation
4. **Service DTO Security** - No sensitive fields in responses
5. **Input Validation Completeness** - Zod schema validation
6. **Action Layer Authorization** - Admin role verification
7. **Role Mapping Round-Trip** - Celestial name conversions
8. **Automatic Role Assignment on Registration** - Trigger behavior
9. **Audit Log Completeness** - All changes logged
10. **Migration Idempotence** - Repeatable migrations
11. **Pagination Default Behavior** - Default page/pageSize
12. **Last Admin Protection** - Cannot remove last admin
13. **Service Error Handling** - Descriptive errors
14. **Hook Error Resilience** - Defaults to 'user' on errors
15. **Service Method Consistency** - CRUD operation consistency

## Test Structure

```
test/
├── config/
│   └── property-test.config.ts    # Test configuration and generators
├── properties/
│   └── role.properties.test.ts    # All 15 property tests
├── integration/
│   ├── role.integration.test.ts   # Database and RLS integration tests
│   └── README.md                  # Integration test documentation
├── unit/
│   └── role.utils.test.ts         # Utility function unit tests
├── smoke/
│   ├── role.smoke.test.ts         # Infrastructure validation tests
│   └── README.md                  # Smoke test documentation
├── setup.ts                       # Global test setup
└── README.md                      # This file
```

## Prerequisites

1. **Environment Variables**: Ensure `.env.local` contains:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://euhfhbpcqsfkfhmyvrzw.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Local Supabase**: For integration tests, start local Supabase:
   ```bash
   npx supabase start
   ```

3. **Migration Applied**: Ensure the roles migration is applied:
   ```bash
   npx supabase db reset
   ```

## Running Tests

### All Tests
```bash
npm test
```

### Property Tests Only
```bash
npm run test:properties
```

### Integration Tests Only
```bash
npm run test:integration
```

### Unit Tests Only
```bash
npm run test:unit
```

### Smoke Tests Only
```bash
npm run test:smoke
```

### With UI
```bash
npm run test:ui
```

### With Coverage
```bash
npm run test:coverage
```

### Single Test Run (CI)
```bash
npm run test:run
```

## Test Types

### Property-Based Tests (`test/properties/`)
Validate universal correctness properties using fast-check generators. Each property runs 100 iterations with random inputs to ensure behavior holds across all valid inputs.

### Integration Tests (`test/integration/`)
Test database operations, RLS policies, triggers, and JWT hooks with real Supabase instances. Validates that components work correctly together.

### Unit Tests (`test/unit/`)
Test individual utility functions in isolation. Fast, focused tests for pure functions like role mapping utilities.

### Smoke Tests (`test/smoke/`)
Validate infrastructure configuration after deployment. Checks that tables, functions, triggers, indexes, and RLS policies exist and are configured correctly.

## Test Configuration

Each property test runs 100 iterations by default (configured in `test/config/property-test.config.ts`).

Some tests have reduced iterations (10) for integration tests that interact with the database.

## Property Test Format

Each test follows this format:

```typescript
it('Property X: Description', async () => {
  // Feature: supabase-roles-jwt-hooks, Property X: Property Name
  // Validates: Requirements X.X, X.X

  await fc.assert(
    fc.asyncProperty(
      arbitraries.userId,
      arbitraries.appRole,
      async (userId, role) => {
        // Test logic
        expect(result).toBe(expected);
      }
    ),
    { numRuns: 100 }
  );
});
```

## Generators (Arbitraries)

Available generators in `test/config/property-test.config.ts`:

- `arbitraries.appRole` - Valid role values ('user', 'moderator', 'admin')
- `arbitraries.userId` - Valid UUID v4 strings
- `arbitraries.timestamp` - ISO 8601 timestamps
- `arbitraries.pagination` - Valid pagination parameters
- `arbitraries.invalidUuid` - Invalid UUID strings (for negative testing)
- `arbitraries.invalidRole` - Invalid role strings (for negative testing)

## Test Data Cleanup

Tests automatically clean up created data in `afterEach` hooks. Test user IDs are tracked in the `testUserIds` array.

## Debugging

To debug a specific property test:

1. Add `.only` to the test:
   ```typescript
   it.only('Property 7: Role mapping round-trip', () => {
     // ...
   });
   ```

2. Run with verbose output:
   ```bash
   npm test -- --reporter=verbose
   ```

3. Use the UI for interactive debugging:
   ```bash
   npm run test:ui
   ```

## CI/CD Integration

For CI/CD pipelines, use:

```bash
# Run all tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

## Notes

- Some tests (Property 2, 3, 6, 10, 14) are placeholders that require full integration testing
- Property 2 (JWT Hook) requires the custom access token hook to be enabled in Supabase Dashboard
- Property 3 (RLS) requires authenticated clients with different roles
- Property 12 (Last Admin Protection) requires careful setup to ensure only one admin exists

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not set"
Ensure `.env.local` exists and contains the required environment variables.

### "Cannot connect to Supabase"
Ensure local Supabase is running: `npx supabase start`

### "Migration not applied"
Reset the database: `npx supabase db reset`

### Tests timing out
Increase timeout in `vitest.config.ts` or reduce `numRuns` in test configuration.

## References

- [fast-check Documentation](https://fast-check.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Design Document](.kiro/specs/supabase-roles-jwt-hooks/design.md)
- [Requirements Document](.kiro/specs/supabase-roles-jwt-hooks/requirements.md)
