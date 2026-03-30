# Hardhat

Deploy contract on localhost:
```
$ pnpm hardhat node
$ pnpm hardhat ignition deploy ignition/modules/Ballot.ts --network localhost
```

Run hardhat tests with coverage
```
$ pnpm hardhat coverage
```

# Foundry

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
$ pnpm slither
```
