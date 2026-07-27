# Tokenizer42

> A 42 Tokenizer project that implements, tests, and deploys a fungible token on BNB Smart Chain Testnet.

## Overview

Tokenizer42 is an educational Web3 project built for the **42 Tokenizer** subject. It demonstrates the complete lifecycle of a blockchain token:

- implementing the token contract in Solidity;
- compiling and testing it with Hardhat 3;
- deploying it locally and on a public test network;
- publishing the contract address on a blockchain explorer;
- demonstrating standard token operations such as transfers and allowances;
- keeping deployment credentials outside the repository.

The token is deployed only on **BNB Smart Chain Testnet**. Testnet BNB and TK42 have no real monetary value.

## Public deployment

| Property | Value |
|---|---|
| Token name | `Tokenizer42` |
| Ticker | `TK42` |
| Standard | BEP-20 / ERC-20-compatible fungible token |
| Network | BNB Smart Chain Testnet |
| Chain ID | `97` |
| Decimals | `18` |
| Initial supply | `1,000,000 TK42` |
| Contract address | `0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720` |
| Explorer | [View the contract on BscScan Testnet](https://testnet.bscscan.com/address/0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720) |

| Second contract | (https://testnet.bscscan.com/address/0x2516bF8448f8333e1DB273626Cf646cC739d0724)

## Design choices

### Why the name Tokenizer42?

The subject requires the token name to contain `42`. **Tokenizer42** directly identifies the project and its educational purpose, while `TK42` provides a short and recognizable ticker.

### Why BNB Smart Chain Testnet?

BNB Smart Chain was selected because it supports EVM smart contracts and token standards compatible with ERC-20. The testnet allows the contract to be deployed and demonstrated publicly without using real money.

### Why Solidity?

Solidity is the principal smart-contract language for EVM-compatible networks. It provides the language features and ecosystem needed to implement a standard fungible token.

### Why Hardhat 3?

Hardhat is used as the development and deployment environment because it provides:

- Solidity compilation;
- automated tests;
- a local blockchain node;
- scripted interaction with contracts;
- Hardhat Ignition deployments;
- encrypted configuration variables through the Hardhat keystore.

### Token purpose

TK42 is a demonstration token created to validate standard fungible-token behavior. It is not presented as money, an investment, company equity, or a claim on real-world assets.

## Repository structure

```text
.
├── README.md
├── code/
│   └── TokenizerToken.sol
├── deployment/
│   ├── contracts/                 # synchronized Hardhat copy
│   ├── ignition/
│   │   └── modules/
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.ts
│   └── package.json
└── documentation/
```

The authoritative Solidity source is:

```text
code/TokenizerToken.sol
```

Hardhat cannot compile a Solidity source located outside its project directory. The deployment workspace therefore synchronizes the authoritative source into:

```text
deployment/contracts/TokenizerToken.sol
```

Do not edit the synchronized copy directly.

## Prerequisites

Install the following tools before running the project:

- Node.js and npm;
- Git;
- MetaMask or another EVM-compatible wallet;
- a dedicated account funded only with testnet BNB for public deployment.

No real cryptocurrency is required.

## Installation

```bash
cd deployment
npm install
```

Confirm that the local Hardhat installation is available:

```bash
npx hardhat --version
```

Use `npx hardhat`, not a globally installed `hardhat` command.

## Contract synchronization

Synchronize the authoritative contract manually with:

```bash
npm run sync:contract
```

The normal compile, test, local-node, and deployment scripts synchronize it automatically.

## Compile and test

```bash
npm run compile
npm test
```

The tests should cover the token metadata and the principal fungible-token operations:

- `name`, `symbol`, `decimals`, `totalSupply`, and `balanceOf`;
- `transfer`;
- `approve` and `allowance`;
- `transferFrom`.

## Local deployment

Start a local Hardhat node:

```bash
npm run node
```

Leave it running. In a second terminal:

```bash
cd deployment
npm run deploy:local
```

This local workflow should be completed before deploying to a public test network.

## BNB Smart Chain Testnet configuration

### 1. Prepare a test-only wallet

Use a dedicated MetaMask account that contains no real assets. Fund it with testnet BNB only.

### 2. Store secrets in the Hardhat keystore
Use these commands to set up manually the secrets or save them in the .env file. In this project, I use .env file.

```bash
cd deployment
npx hardhat keystore set BSC_TESTNET_RPC_URL
npx hardhat keystore set BSC_TESTNET_PRIVATE_KEY
```

Enter the RPC endpoint as the first secret and the private key of the dedicated testnet account as the second secret.

Never place an RPC API key, private key, wallet password, or recovery phrase in source code, a `.env` file committed to Git, terminal screenshots, or project documentation.

### 3. Verify the stored variable names

```bash
npx hardhat keystore list
```

The list should include:

```text
BSC_TESTNET_RPC_URL
BSC_TESTNET_PRIVATE_KEY
```

The command displays variable names, not their secret values.

## Public testnet deployment

Deploy with the default initial supply:

```bash
npm run deploy:bsc-testnet
```

To supply custom Ignition parameters:

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet \
```
Deploy a second contract with a different supply: Use below commands to create this contract: https://testnet.bscscan.com/address/0x2516bF8448f8333e1DB273626Cf646cC739d0724

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet \
  --parameters parameters.example.json \
  --deployment-id bsc-testnet-custom-supply
```
  
## Inspect the deployed token

```bash
TOKEN_ADDRESS=0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720 \
npm run inspect:bsc-testnet
```

The inspection should report the token name, ticker, decimals, total supply, and deployer balance.

## Demonstrate a transfer

Use a recipient address different from the deployer so that the balance change is visible:

```bash
TOKEN_ADDRESS=0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720 \
RECIPIENT_ADDRESS=0xRECIPIENT_ADDRESS \
TOKEN_AMOUNT=1 \
npm run transfer:bsc-testnet
```

TOKEN_ADDRESS=0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720 \
RECIPIENT_ADDRESS=0x2516bF8448f8333e1DB273626Cf646cC739d0724 \
TOKEN_AMOUNT=1 \
npm run transfer:bsc-testnet

The command returns a transaction hash. Open that hash on BscScan Testnet to verify the transaction status and emitted `Transfer` event.

## ERC-20/BEP-20 command-line demonstration

The reusable script `deployment/scripts/erc20-cli.ts` supports the following actions:

```text
info
transfer
approve
allowance
transferFrom
```

Define the public addresses used by the commands:

```bash
export TOKEN_ADDRESS="0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720"
export OWNER_ADDRESS="0x5784aaaBB5BFf17659aC3dEC9d7d97E9E3010395"
export RECIPIENT_ADDRESS="0x2516bF8448f8333e1DB273626Cf646cC739d0724"
```

### Read token metadata and an account balance

```bash
ACTION=info \
ACCOUNT_ADDRESS="$OWNER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

### Transfer tokens

```bash
ACTION=transfer \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
TOKEN_AMOUNT="1" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

### Approve a spender

```bash
export SPENDER_ADDRESS="$OWNER_ADDRESS"

ACTION=approve \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
TOKEN_AMOUNT="5" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

`approve` sets the allowance to the supplied amount. It does not add that amount to an existing allowance.

### Read an allowance

```bash
ACTION=allowance \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

### Execute `transferFrom`

For a complete demonstration, configure the spender as a first Hardhat signer and run the command with its signer index:

```bash
SIGNER_INDEX=0 \
ACTION=transferFrom \
FROM_ADDRESS="$OWNER_ADDRESS" \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
TOKEN_AMOUNT="1" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

A successful call should:

- decrease the owner's token balance;
- increase the recipient's token balance;
- decrease the spender's remaining allowance by the transferred amount.

Using the same address as owner and recipient creates a self-transfer: the transaction is valid and the allowance is consumed, but the account's net token balance does not change.

## Security principles

- Use test networks only for this project.
- Use a dedicated deployment wallet with no real assets.
- Never commit private keys, seed phrases, passwords, API keys, or keystore files.
- Never expose secrets in screenshots, shell history, documentation, or issue reports.
- Validate addresses and amounts before submitting a transaction.
- Review ownership and privileged functions before deployment.
- Keep dependencies and generated artifacts out of the repository unless explicitly required.

A typical `.gitignore` should exclude at least:

```gitignore
node_modules/
.env
artifacts/
cache/
ignition/deployments/
*.log
```

Public contract addresses and transaction hashes are safe to publish. Wallet private keys and recovery phrases are not.

## Evaluation checklist

- [x] Token name contains `42`.
- [x] Solidity source is stored in `code/`.
- [x] Deployment tooling is separated into `deployment/`.
- [x] Project documentation is stored in `documentation/`.
- [x] The token follows the fungible-token standard used by BNB Smart Chain.
- [x] The contract can be compiled and tested locally.
- [x] Minimal token operations can be demonstrated from the terminal.
- [x] The token is deployed on a public test blockchain.
- [x] The network and public contract address are documented.
- [x] No real money is required.
- [ ] Optional multisignature bonus, when implemented and documented.

## Bonus direction

The optional subject bonus proposes adapting a multisignature mechanism to the mandatory implementation. This should be attempted only after the complete mandatory project is stable, tested, documented, and demonstrable.

## Disclaimer

Tokenizer42 is an educational testnet project. TK42 has no guaranteed value, utility, ownership rights, or financial backing. Nothing in this repository is financial or investment advice.
