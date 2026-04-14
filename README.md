# dapp-boilerplate

This repository is a **boilerplate**—a ready-made starting point—for building a **decentralized application (DApp)**. It combines a web frontend, Solidity contracts, and a testing and continuous-integration toolchain. The goal is not to ship a finished product, but to give you a **consistent, tested, and documented** base you can **clone, adapt, and extend** for your own project.

## What’s in the monorepo

| Part | Role |
|------|------|
| **`frontend/`** | [Next.js](https://nextjs.org/) UI (App Router), wallet connection via [Reown](https://reown.com/) (formerly WalletConnect) and [Wagmi](https://wagmi.sh/) / [Viem](https://viem.sh/), UI (Radix, Tailwind, etc.). |
| **`backend/`** | Ethereum contracts and tooling: [Hardhat](https://hardhat.org/), [Foundry](https://book.getfoundry.sh/) (Forge), [Ignition](https://hardhat.org/ignition) deployments, and a sample **Ballot** (voting) contract. |

Both packages are wired as **[Bun](https://bun.sh) workspaces**: install once at the repo root, single lockfile (`bun.lock`).

## Prerequisites

- **[Bun](https://bun.sh)** `>= 1.1.0` (package manager and script runner).
- **[Node.js](https://nodejs.org/)** `22+` recommended for Node-based CLIs (Hardhat, Next.js, etc.).
- **[Foundry](https://book.getfoundry.sh/getting-started/installation)** (`forge`, `cast`, …) to compile and test Forge-side contracts and to mirror CI locally.

Typical Foundry install:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

After cloning, initialize **Git submodules** if the repo uses them (for example Solidity deps under `backend/lib/`):

```bash
git submodule update --init --recursive
```

## Installation

From the **repository root**:

```bash
bun install
```

This installs dependencies for the `frontend` and `backend` workspaces.

## Environment variables

Each app has its own template:

- **Frontend**: copy `frontend/.env.example` to `frontend/.env` and set at least `NEXT_PUBLIC_REOWN_PROJECT_ID`, plus Alchemy URLs if you use public networks (see [frontend/README.md](frontend/README.md)).
- **Contracts**: copy `backend/.env.example` to `backend/.env` for remote deploys, block explorer verification (`ETHERSCAN_API_KEY`), and optional `PRIVATE_KEY` on configured networks (see [backend/README.md](backend/README.md)).

Without these files, local development may be limited to the in-process Hardhat network, depending on configuration.

## Quick start

| Action | Example command |
|--------|------------------|
| Run the frontend in dev | `cd frontend && bun run dev`, then open [http://localhost:3000](http://localhost:3000) |
| Start a local Hardhat node | `cd backend && bun run start:node` (default RPC `127.0.0.1:8545`) |
| Run contract tests (Hardhat then Foundry) | `cd backend && bun run test` |

From the **root**, you can target a workspace without changing directory:

```bash
bun run --filter frontend dev
bun run --filter backend test
```

## Detailed docs

- [frontend/README.md](frontend/README.md) — Next.js, Web3, Playwright E2E, spelling (cspell), etc.
- [backend/README.md](backend/README.md) — Hardhat, Forge, Ignition, Slither, coverage.

## Continuous integration

The [`.github/workflows/ci-tests.yml`](.github/workflows/ci-tests.yml) workflow runs three jobs (typically on `main` / `dev` and pull requests):

1. **Frontend** — spelling, Prettier lint, dependency audit (high+), Playwright E2E.
2. **Backend** — spelling, lint (Solhint + Prettier), audit, Hardhat tests with coverage (100% goal excluding `lib/**`).
3. **Backend Solidity** — Forge compile with build info, [Slither](https://github.com/crytic/slither) analysis, Forge coverage (100% goal).

Shared setup (Bun, Node, `bun install --frozen-lockfile`) lives in [`.github/actions/setup/action.yml`](.github/actions/setup/action.yml).

## Git hooks

Each workspace’s `prepare` script sets `core.hooksPath` to `.githooks` for consistent local checks. Confirm your clone points there:

```bash
git config --local core.hooksPath
# expected: .githooks
```

If needed:

```bash
git config --local core.hooksPath .githooks
```

## License

See [LICENSE](LICENSE) at the repository root.
