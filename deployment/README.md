# Deployment tools

This folder is the Hardhat 3 workspace used to compile, test, deploy, inspect, and transfer `Tokenizer42` (`TK42`). The authoritative Solidity source is `../code/TokenizerToken.sol`. Hardhat 3 does not allow source files outside its project directory, so each compile, test, local-node, and deployment command first synchronizes that file into `contracts/TokenizerToken.sol`. Do not edit the generated deployment copy directly.

## Install

```bash
cd deployment
rm -rf node_modules package-lock.json
npm install
```

The toolbox installs its compatible Hardhat plugins as peer dependencies. Do not add or pin the bundled plugins (`hardhat-ethers`, `hardhat-ignition`, `hardhat-verify`, and related packages) separately unless the code imports them directly. Independent pins can create an `ERESOLVE` conflict.

No `node_modules`, `.env`, API key, private key, password, seed phrase, build artifact, or cache file belongs in the repository.

## Contract synchronization

Run this manually whenever you want to refresh the Hardhat-local copy:

```bash
npm run sync:contract
```

The normal compile, test, node, and deployment scripts run it automatically.

## Local validation

```bash
npm run compile
npm test
npm run node
```

Leave the node running and, from another terminal:

```bash
cd deployment
npm run deploy:local
```

## BNB Smart Chain Testnet credentials

Store the RPC URL and the test-only deployment key in the Hardhat keystore:

```bash
npx hardhat keystore set BSC_TESTNET_RPC_URL
npx hardhat keystore set BSC_TESTNET_PRIVATE_KEY
```

Never put either value in a committed file. Use an account containing testnet BNB only.

## Public testnet deployment

```bash
npm run deploy:bsc-testnet
```

To override the default supply:

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet \
  --parameters parameters.example.json
```

After deployment, copy `public-deployment.template.json` to `public-deployment.json` and replace every placeholder with the real public data. Also update the public deployment table in the root `README.md`.

## Inspect the token

```bash
TOKEN_ADDRESS=0x... npm run inspect:bsc-testnet
```

## Demonstrate a transfer

```bash
TOKEN_ADDRESS=0x... \
RECIPIENT_ADDRESS=0x... \
TOKEN_AMOUNT=1 \
npm run transfer:bsc-testnet
```

The transaction hash can then be opened on BscScan Testnet to show the emitted `Transfer` event and the changed balances.
