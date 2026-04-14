# Install

From the repo root (workspaces): `bun install`. If you only touch frontend deps, that single install is enough.

## Environment variables

| File | Role |
|------|------|
| [`.env.example`](.env.example) | Template — copy to `.env` and fill in values. |
| [`.env.test`](.env.test) | Committed defaults for `bun run test:e2e` (Playwright loads this via Bun). |
| `.env` | Private overrides (gitignored). |

Typical app dev: `cp .env.example .env`, then set `NEXT_PUBLIC_REOWN_PROJECT_ID` and any Alchemy URLs. Next.js loads `.env` when you run `bun run dev` / `build`.

# Dev

```
$ bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# End-to-end tests (Playwright)

From `frontend/`:

```bash
bun run test:e2e
```

This runs SSR route checks (`e2e/routes.spec.ts`) and on-chain ballot flows (`e2e/ballot-flows.spec.ts`) against a production build (`next build` + `next start`). Ballot specs cover registration, votes, delegation, dashboard (winner, chair, voters count, delegatee weight, proposals list), proposals/events/votes pages, sidebar navigation, give-right UI for the chair, and filtered event tables. The web server is started with `NEXT_PUBLIC_E2E_AUTO_CONNECT=1` so the app uses the injected Hardhat wallet in tests (see `e2e/helpers/hardhat-wallet.ts`).

**Hardhat:** global setup resets the local chain and deploys the Ballot via Ignition. If nothing listens on `127.0.0.1:8545`, a `hardhat node` process is spawned from `../backend` and torn down after the run. If a node is already running, it is reused (PID file records `reuse`).

**Faster local runs (routes only):** skip chain setup when you are not running ballot specs:

```bash
PW_SKIP_BALLOT_SETUP=1 bun run test:e2e --grep routes
```

Do not set `PW_SKIP_BALLOT_SETUP` when executing `ballot-flows.spec.ts`; those tests require the deployed contract.
