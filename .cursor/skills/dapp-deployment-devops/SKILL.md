---
name: dapp-deployment-devops
description: >-
  Deploys and operates this DApp monorepo—Hardhat Ignition, contract verification,
  Next.js production builds, Alchemy/Reown env vars, CI workflows, staging vs
  production, security and monitoring. Use when deploying contracts or frontend,
  configuring CI/CD, fixing workflow failures, or planning releases.
---

# Deployment and DevOps (DApp boilerplate)

## Smart contract deployment

### Hardhat Ignition

- Use Hardhat Ignition for modules under `backend/ignition/modules/`.
- One deployment module per contract (or coherent group); use environment-specific parameters where needed.
- Implement deployment verification (see Contract verification below).

### Environments

1. **Local**: in-process Hardhat network for development.
2. **Staging**: Ethereum **Sepolia** and/or **Base Sepolia** (RPC via Alchemy-related env vars).
3. **Production**: **Ethereum mainnet** and/or **Base** as required, aligned with `frontend/src/lib/wagmi.config.ts`.

Legacy Polygon zkEVM entries in Hardhat config are **commented out**; prefer the Ethereum/Base stack.

### Contract verification

- Use the Hardhat Etherscan plugin to verify on block explorers after deployment.
- Keep deployment artifacts and verified addresses for later reference.

## Frontend deployment

- Next.js app: see `frontend/package.json` and `frontend/next.config.mjs` (production build, env, caching).
- From `frontend/`: `bun run build` then `bun run start` for production serving.

### Required env vars (typical)

- `ALCHEMY_ENDPOINT_URL_ETHEREUM_MAINNET`
- `ALCHEMY_ENDPOINT_URL_ETHEREUM_SEPOLIA`
- `ALCHEMY_ENDPOINT_URL_BASE_MAINNET`
- `ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA`
- `ALCHEMY_API_KEY`
- `WALLET_CONNECT_PROJECT_ID`

Align runtime networks with `frontend/src/lib/wagmi.config.ts` (Hardhat, Sepolia, Base Sepolia, mainnet, Base).

## CI/CD

- Orchestration: `.github/workflows/` — e.g. `ci-tests.yml` aggregates backend, frontend, and solidity jobs.
- **Git hooks**: `core.hooksPath` → `.githooks` (see root `README.md`); `prepare` scripts configure this locally.

### Automated checks (high level)

- **Backend**: Foundry + Hardhat tests, Slither, solidity tooling — `ci-backend.yml`, `ci-backend-solidity.yml`.
- **Frontend**: cSpell, Prettier lint, `bun audit --audit-level=high` — `ci-frontend.yml`.

### Pipeline mental model

1. Development: local + hot reload.
2. Staging: testnet deploys for integration.
3. Production: mainnet with full verification and monitoring.

## Environment and secrets

- Prefer env-specific config; never commit secrets.
- Use `.env` locally; use proper secret storage in hosted CI/CD.
- Keep deployments and frontend RPC/network config consistent.

## Monitoring and security (checklist)

**Chain**

- Watch critical contract events and transactions; log failures.
- Track gas; rerun Slither before release-grade deploys.

**Frontend**

- Error and performance signals; Web3 connection success rates.

**Hardening**

- Contracts: Slither, access controls, realistic test coverage before mainnet.
- Frontend: input validation, HTTPS in production, safe handling of env.

## Backup and rollback

- Version deployment artifacts, ABIs, and contract addresses.
- Document how to redeploy or roll back frontend config; keep git history as the source of truth for code.

## Best practices (short)

1. Automate repeatable steps; test on testnets before mainnet.
2. Document env and deploy steps for the next maintainer.
3. Plan rollback before risky releases.
