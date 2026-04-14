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
