# Contributing

Thanks for improving this boilerplate. The checklist below matches local hooks and the parts of CI you can run without extra infrastructure.

## Prerequisites

- [Bun](https://bun.sh) `>= 1.1.0` (see `engines` in [`package.json`](package.json))
- [Node.js](https://nodejs.org/) **22+** (Hardhat CLI and Next binaries)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, …) for Solidity in `backend/`

## First-time setup

```bash
git clone <repo-url>
cd dapp-boilerplate
git submodule update --init --recursive   # Solidity libs under backend/lib/
bun install
```

Copy env templates as in the root [`README.md`](README.md) (`frontend/.env`, `backend/.env`).

## Git hooks

Hooks live under [`.githooks/`](.githooks). If `git config core.hooksPath` is not set to `.githooks`, run:

```bash
git config core.hooksPath .githooks
```

Pre-commit runs backend lint + spell + Hardhat tests, then frontend lint + spell.

## Commands

From the repository root:

| Check | Command |
| --- | --- |
| Lint both workspaces | `bun run lint` |
| Tests (Hardhat + Forge + frontend unit) | `bun run test` |
| Frontend production build (placeholder Reown id) | `bun run build` |
| Lint + spell + build + tests (local pre-push style) | `bun run ci:check` |
| Backend only | `bun run --filter backend …` |
| Frontend only | `bun run --filter frontend …` |

Granular scripts are still in each workspace `package.json` (for example `lint:eslint` and `test:e2e` on the frontend). Playwright E2E and Solidity jobs that use Slither or coverage need the tooling described in [`frontend/README.md`](frontend/README.md) and [`backend/README.md`](backend/README.md).

Continuous integration is defined in [`.github/workflows/ci-tests.yml`](.github/workflows/ci-tests.yml).

## Pull requests

- Prefer focused changes with a clear description.
- When dependencies change, run `bun install` at the repo root and commit `bun.lock`.
- Do not commit secrets (`.env`, private keys).

## Security

See [`SECURITY.md`](SECURITY.md) for reporting vulnerabilities.
