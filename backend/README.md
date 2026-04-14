# Backend (Solidity / Hardhat / Foundry)

This folder holds **Ethereum smart contracts** and the surrounding **toolchain**: compilation, tests (both Hardhat and Foundry), Ignition deployments, and Slither static analysis. The main example contract is **`contracts/Ballot.sol`** (voting). This package is the `backend` npm workspace in the Bun monorepo.

## Prerequisites

- **Bun** `>= 1.1.0`.
- **Node.js** `22+` (the Hardhat CLI runs via Node).
- **Foundry** (`forge`, `anvil`, …) — [installation](https://book.getfoundry.sh/getting-started/installation).
- **[Poetry](https://python-poetry.org/docs/#installation)** — only if you run **Slither** through the `package.json` script (`poetry run` wrapper).

After cloning, initialize submodules if the repo depends on them (OpenZeppelin, forge-std, etc.):

```bash
git submodule update --init --recursive
```

Then, from **`backend/`**, sync libraries expected by Forge:

```bash
forge install
```

## Environment files

| File | Role |
|------|------|
| [`.env.example`](.env.example) | Template for **`bunx hardhat verify`**, Ignition deploys to remote networks, and optional RPC URLs (`mainnet`, `sepolia`, `base`, `baseSepolia`). |
| `.env.test` | Reference or safe values for tests / CI (depending on what is committed). |
| `.env` | Real secrets (**not committed**): `PRIVATE_KEY`, `ETHERSCAN_API_KEY`, full Alchemy URLs, etc. |

```bash
cp .env.example .env
```

**Note:** In [`hardhat.config.ts`](hardhat.config.ts), remote HTTP networks are registered **only if** the matching URL is non-empty—Hardhat rejects empty URLs. `PRIVATE_KEY` is only used to populate `accounts` on those networks.

## Versions and paths

- **Solidity** `0.8.28` (aligned with Slither / Forge CI).
- Hardhat (Mocha) tests live under `test/hardhat/`.
- **TypeChain** output goes to `typechain-types/` per Hardhat config.

## npm / Bun scripts

| Script | Description |
|--------|-------------|
| `bun run start:node` | Starts a persistent Hardhat node (`hardhat node`), usually at `127.0.0.1:8545`. |
| `bun run test` | Runs **`test:hardhat`** then **`test:foundry`**. |
| `bun run test:hardhat` | Hardhat Mocha tests. |
| `bun run test:hardhat:coverage` | Same with coverage report (`coverage/`). |
| `bun run test:hardhat:gas` | Tests with gas statistics. |
| `bun run test:foundry` | `forge test`. |
| `bun run lint` | Solhint + Prettier (TS + Solidity). |
| `bun run lint:*:fix` | Variants with autofix where applicable. |
| `bun run cspell` | Spell check on tracked files (including `.sol`). |
| `bun run docgen` | Forge docs (`forge doc`). |
| `bun run slither` | Slither analysis (`poetry install` under `backend/` required first). |
| `bun run prepare` | Configures local Git hooks (`core.hooksPath`). |

One-off Hardhat examples (from `backend/`):

```bash
bunx hardhat compile
bunx hardhat test mocha
```

## Code coverage

- **Hardhat:** `bun run test:hardhat:coverage` produces `coverage/lcov.info` among other outputs. CI enforces 100% coverage excluding `lib/**`.
- **Foundry:** `forge coverage` (and `lcov` generation in CI). See [`.github/workflows/ci-backend-solidity.yml`](../.github/workflows/ci-backend-solidity.yml).

## Local deploy (Ignition)

1. Start the node (dedicated terminal):

   ```bash
   bun run start:node
   ```

2. Deploy the Ballot module to `localhost`:

   ```bash
   bunx hardhat ignition deploy ignition/modules/Ballot.ts --network localhost
   ```

Change the module path if you add more Ignition modules. For **testnets / mainnets**, fill in `.env` (URLs + key as needed) and use the matching Hardhat **network name** (`sepolia`, `baseSepolia`, etc.).

## Block explorer verification

With `ETHERSCAN_API_KEY` in `.env`, use the standard Hardhat verify flow for your target network and contract address. Exact commands depend on the network and verify plugin version—see [Hardhat Verify](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify).

## Slither

1. Install the folder’s Python dependencies: `poetry install` (there is a `pyproject.toml`).
2. Run:

   ```bash
   bun run slither
   ```

CI builds with `forge build --build-info`, then runs Slither with `ignore-compile` and [`slither.config.json`](slither.config.json). Locally, keep your Forge build fresh if you want parity with CI.

## Continuous integration (summary)

- **Backend** ([`ci-backend.yml`](../.github/workflows/ci-backend.yml)) — submodules, Foundry nightly toolchain, spelling, lint, Bun audit, Hardhat tests with minimum 100% coverage (excluding `lib/**`).
- **Backend Solidity** ([`ci-backend-solidity.yml`](../.github/workflows/ci-backend-solidity.yml)) — `forge build`, Slither on `contracts/`, 100% Forge coverage target.

## Links

- [Root README](../README.md) — boilerplate overview.
- [frontend/README.md](../frontend/README.md) — wallet connection, Playwright E2E, `NEXT_PUBLIC_*` variables.
