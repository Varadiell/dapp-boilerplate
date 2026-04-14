# Frontend (Next.js)

Web application for the monorepo: a DApp UI built with **Next.js**, **React**, **Wagmi** / **Viem**, and **Reown AppKit** for wallet connections. This folder is the `frontend` npm package in the Bun workspace defined at the repo root.

## Prerequisites

- **Bun** `>= 1.1.0` (see the repository root).
- **Node.js** `22+` recommended for CLIs (Next, ESLint, etc.).

## Installing dependencies

From the **repository root** (recommended for a single `bun.lock`):

```bash
bun install
```

Even if you only work in `frontend/`, run installs from the root to stay aligned with CI.

## Environment files

| File | Role |
|------|------|
| [`.env.example`](.env.example) | Template—copy to `.env` and fill in values. |
| [`.env.test`](.env.test) | Values used for `bun run test:e2e` (loaded via Bun; may be committed). |
| `.env` | Local secrets and overrides (**not committed**; create from `.env.example`). |

For day-to-day development:

```bash
cp .env.example .env
```

Then set at least:

- **`NEXT_PUBLIC_REOWN_PROJECT_ID`** — [Reown Cloud](https://dashboard.reown.com) project ID. In **production builds**, the app refuses to start if the ID is missing or still set to the placeholder `DUMMY` (see `src/lib/wagmi.config.ts`).
- **Alchemy variables** — `ALCHEMY_API_KEY` and `ALCHEMY_ENDPOINT_URL_*` URLs if you connect to the public networks listed in the Wagmi config (Sepolia, Base Sepolia, Ethereum, Base). Without them, the **local Hardhat** network may be enough for simulated-chain testing.

Next.js loads `.env`, `.env.local`, `.env.development`, etc. depending on the mode (`dev`, `build`, `start`).

## npm / Bun scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Next.js dev server ([http://localhost:3000](http://localhost:3000)). |
| `bun run build` | Production build. |
| `bun run start` | Serve the production build (after `build`). |
| `bun run lint` | Prettier check on `**/*.{js,ts,tsx}`. |
| `bun run lint:prettier:ts:fix` | Same with autofix. |
| `bun run cspell` | Spell check (git-tracked files; French dictionary available). |
| `bun run test` | Bun unit tests (`--pass-with-no-tests` if none). |
| `bun run test:e2e` | **Playwright** tests (see below). |
| `bun run prepare` | Sets `core.hooksPath` to this package’s `.githooks` (at repo root, the monorepo hook may be the one that matters). |

## Useful code layout

- **`src/app/`** — App Router routes (`layout.tsx`, `page.tsx`, etc.).
- **`src/lib/wagmi.config.ts`** — Networks (Hardhat, Sepolia, Base Sepolia, Ethereum, Base), RPC transports (Alchemy), Reown / Wagmi adapter.
- **`src/contexts/web3-provider.tsx`** — Wagmi, React Query, and wallet modal providers.
- **`src/contracts/`** — ABI and address config (e.g. Ballot contract).
- **`src/hooks/ballot/`** — On-chain reads and event logs for Ballot.
- **`src/locales/`** — Translations (e.g. `en`, `fr`) via i18next.
- **`src/stores/`** — Client UI state (Zustand), alongside Wagmi / TanStack Query.

Rename or replace these areas if you swap the Ballot example for your own contracts.

## Dependencies (Radix / shadcn inventory)

`src/components/ui/` follows the usual **shadcn/ui** pattern and declares many **Radix**-related packages in `package.json`. Not every file is used in the sample screens; that is normal for a starter kit. As the product UI stabilizes, remove unused components and drop the matching dependencies to keep upgrades smaller. CI already runs **`bun audit --audit-level=high`**; for a stricter inventory pass you can run **`bunx knip`** (expect false positives on pre-built UI—treat results as hints, not a hard gate).

## End-to-end tests (Playwright)

Run E2E from `frontend/`:

```bash
bun run test:e2e
```

This uses `bun --env-file=./.env.test` to load test env vars, then runs Playwright.

### General behavior

- Specs include **SSR route checks** (`e2e/routes.spec.ts`) and **on-chain Ballot flows** (`e2e/ballot-flows.spec.ts`) against a **production build** (`next build` then `next start`), matching CI.
- For Ballot flows, **global setup** resets the local chain and deploys the contract with **Ignition**. If nothing listens on `127.0.0.1:8545`, a `hardhat node` process is started from `../backend` and torn down afterward; if a node is already running, it is **reused**.
- **`NEXT_PUBLIC_E2E_AUTO_CONNECT=1`** is set on the test server so the app uses the injected Hardhat wallet in tests (see `e2e/helpers/hardhat-wallet.ts`).

### Faster run (routes only)

To skip chain and contract setup when you only run route tests:

```bash
PW_SKIP_BALLOT_SETUP=1 bun run test:e2e --grep routes
```

Do **not** set `PW_SKIP_BALLOT_SETUP` when running `ballot-flows.spec.ts`; those tests require the deployed contract.

### CI

On GitHub Actions, Chromium is installed with `bunx playwright install chromium --with-deps`, and `NEXT_PUBLIC_REOWN_PROJECT_ID` is set to an E2E placeholder. See [`.github/workflows/ci-frontend.yml`](../.github/workflows/ci-frontend.yml).

## Dependency quality and security

- **`bun audit --audit-level=high`** runs in CI (see the frontend workflow).
- Keep **keys and IDs out of the repo**; only use `NEXT_PUBLIC_` prefixes for values that must be exposed to the browser.

## See also

- [Root README](../README.md) — monorepo overview and backend links.
- [backend/README.md](../backend/README.md) — Hardhat node, Ignition deploy, contract tests.
