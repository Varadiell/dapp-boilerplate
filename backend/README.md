# Environment

| File | Role |
|------|------|
| [`.env.example`](.env.example) | Template — copy to `.env` for verify, Ignition, and optional `mainnet` / `sepolia` / `base` / `baseSepolia` RPC URLs. |
| [`.env.test`](.env.test) | Empty safe defaults for tests/CI (optional reference). |
| `.env` | Private secrets (gitignored). |

# Hardhat

Deploy contract on localhost:
```
$ bun run start:node
$ bunx hardhat ignition deploy ignition/modules/Ballot.ts --network localhost
```

Run hardhat tests with coverage
```
$ bun run test:hardhat:coverage
```

# Foundry

Install Solidity libraries listed in this project (`lib/`, git submodules). From `backend/`:

```
$ forge install
```

Run foundry tests with coverage
```
$ forge coverage
```

# Slither

Install [Poetry](https://python-poetry.org/docs/#installation), then from `backend/`:

```
$ poetry install
```

Run analysis:

```
$ bun run slither
```
