# Deployment guide

## Prerequisites

- Node.js 22 or later;
- npm;
- a BNB Smart Chain Testnet RPC endpoint;
- a test-only wallet funded with testnet BNB.

Real money is not required and must not be used for this project.

## Install, compile, and test

```bash
cd deployment
rm -rf node_modules package-lock.json
npm ci
npm run compile
npm run typecheck
npm test
```

The Ethers + Mocha toolbox installs compatible versions of its bundled plugins automatically. The configuration compiles the source in the repository-level `code` folder. The tests cover identity, supply, transfers, allowances, zero supply, insufficient balances, invalid receivers, and insufficient allowances.

## Local deployment

Terminal 1:

```bash
cd deployment
npm run node
```

Terminal 2:

```bash
cd deployment
npm run deploy:local
```

The local chain and address are for development only. A local chain ID or address is not proof of the mandatory public deployment.

## Protected configuration

```bash
cd deployment
npx hardhat keystore set BSC_TESTNET_RPC_URL
npx hardhat keystore set BSC_TESTNET_PRIVATE_KEY
```

The private key must belong to a dedicated test account. Do not commit it, print it in documentation, paste it into screenshots, or reuse it for real assets.

## Public deployment

```bash
cd deployment
npm run deploy:bsc-testnet
```

The Ignition module defaults to `1,000,000 × 10^18` smallest units. The constructor rejects an initial supply of zero.

Record the returned contract address and deployment transaction. Update:

- the public deployment table in the root `README.md`;
- a new `deployment/public-deployment.json` copied from the template.

## Explorer checks

On BscScan Testnet, confirm:

- the address contains smart-contract bytecode;
- the network is BNB Smart Chain Testnet;
- the token name contains `42`;
- the ticker `TK42` is visible;
- total supply and holder balances are correct;
- a transfer transaction succeeds and emits `Transfer`.

Do not insert a local Hardhat address into the public deployment record.
