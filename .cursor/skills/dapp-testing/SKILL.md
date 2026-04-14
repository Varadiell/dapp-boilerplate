---
name: dapp-testing
description: >-
  Writes and runs tests in this monorepo—Foundry and Hardhat for Solidity,
  frontend component/Web3 testing patterns, Slither, coverage goals, E2E and
  cross-network integration. Use when adding or fixing tests, improving coverage,
  mocking Wagmi, or aligning with CI.
---

# Testing strategy (DApp boilerplate)

## Backend (dual framework)

**Foundry** (`backend/test/foundry/`)

- Fast, native Solidity tests; good for units, gas, fuzzing, invariants.
- Run: `cd backend && bun run test:foundry`

**Hardhat** (`backend/test/hardhat/`)

- TypeScript integration tests; good for tooling-heavy scenarios.
- Run: `cd backend && bun run test:hardhat`

**All backend tests**: `cd backend && bun run test`

### Structure and content

Follow patterns in `backend/test/foundry/Ballot.t.sol`:

- Descriptive test names; cover public API, edge cases, reverts, events, access control.

### Security-oriented testing

- `cd backend && bun run slither` for static analysis.
- Use Foundry invariant tests and fuzzing where inputs vary widely.

## Frontend

CI currently runs **cSpell**, **Prettier**, and **audit** for the frontend (`ci-frontend.yml`); there is no Vitest/Jest script in `frontend/package.json` yet.

When adding a runner, prefer **Vitest** or **Jest** with **React Testing Library**; mock Wagmi/viem as needed.

### What to test

- **Components**: `frontend/src/components/ui/`, `frontend/src/components/shared/` in isolation.
- **Web3**: mock Wagmi hooks; exercise transaction flows, errors, and connection states.

## Integration and E2E

End-to-end flows to cover when tooling exists:

- Wallet connection, contract calls, receipts, error recovery.

**Environments to exercise** (with care on mainnet / cost):

- Local Hardhat
- Sepolia and/or Base Sepolia
- Ethereum mainnet and/or Base (only with explicit safety and test funds)

## Data and isolation

- Reusable fixtures; consistent test data across frameworks.
- Mock externals and chain where unit speed matters; use realistic data for integration.

## Coverage targets (aspirational)

- **Contracts**: aim for high coverage (e.g. >90% on critical paths).
- **Frontend**: aim for strong coverage on critical UI and Web3 paths when a runner exists.
- **Integration**: major user journeys should be represented.

## Conventions

1. Tests are independent (no order dependence).
2. Names describe behavior; use Arrange–Act–Assert.
3. Test both success and failure paths.
4. In Foundry, monitor gas where relevant.

## Commands reference

From `backend/package.json`:

- `bun run test` — Foundry + Hardhat
- `bun run test:foundry` — Foundry only
- `bun run test:hardhat` — Hardhat only
- `bun run slither` — static analysis
