# dapp-boilerplate

Monorepo with [Bun workspaces](https://bun.sh/docs/install/workspaces) (`frontend`, `backend`). Install once from the repository root:

```
$ bun install
```

Then run package scripts from each app directory (e.g. `cd frontend && bun run dev`) or use filters from the root, e.g. `bun run --filter frontend dev`.

## Frontend E2E tests

Playwright runs from the `frontend` package (`bun run test:e2e`). See [frontend/README.md](frontend/README.md#end-to-end-tests-playwright) for Hardhat, env flags, and route-only runs.

Install Foundry (for contracts):

```
$ curl -L https://foundry.paradigm.xyz | bash
```

## Githooks

Check that your core.hookspath is ".githooks"

```
$ git config --local core.hooksPath
```

Else, set value to ".githooks"

```
$ git config --local core.hooksPath .githooks
```
