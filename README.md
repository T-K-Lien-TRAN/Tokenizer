# Tokenizer42 (`TK42`)

Tokenizer42 is a fixed-supply fungible token created for the 42 **Tokenizer — Build your own token** exercise. The contract follows the ERC-20 interface and is intended to be deployed as a BEP-20-compatible token on **BNB Smart Chain Testnet**.

> Tokenizer42 is an educational test token. It has no monetary value and is not intended for production use, investment, fundraising, or sale.

## Token summary

| Property | Value |
|---|---|
| Token name | `Tokenizer42` |
| Ticker | `TK42` |
| Standard | ERC-20 interface; BEP-20 compatible on BNB Smart Chain |
| Target network | BNB Smart Chain Testnet, chain ID `97` |
| Language | Solidity |
| Framework | Hardhat 3 with TypeScript and ethers |
| Deployment | Hardhat Ignition |
| Base contract | OpenZeppelin `ERC20` |
| Decimals | `18` |
| Default initial supply | `1,000,000 TK42` |
| Supply policy | Fixed; minted once during construction |
| Initial holder | Deployment account |
| Owner/admin roles | None |
| Upgradeability | None |

## Platform choice

BNB Smart Chain Testnet was selected because it is a public EVM-compatible test network. It supports Solidity and the ERC-20-compatible BEP-20 token model while allowing deployment and evaluation with testnet funds rather than real money. Its explorer can show the smart-contract address, network, ticker, supply, holders, transactions, and emitted events.

Other EVM platforms could run the same interface, but BNB Smart Chain Testnet matches the project context and provides a straightforward public demonstration through BscScan Testnet.

## Language and tools

- **Solidity** implements the token on an EVM-compatible blockchain.
- **OpenZeppelin ERC20** supplies reviewed standard balance, transfer, allowance, and event logic instead of duplicating that logic manually.
- **Hardhat 3** compiles, tests, runs a local chain, connects to BNB Smart Chain Testnet, and manages deployment.
- **TypeScript and ethers** are used for readable automated tests and interaction scripts.
- **Hardhat Ignition** defines a reproducible deployment with an explicit initial-supply parameter.

## Token behavior

The constructor accepts an `initialSupply` in the smallest unit. A zero supply is rejected. The complete non-zero supply is then minted to the deployment account.

The token exposes the standard ERC-20 actions inherited from OpenZeppelin:

- `name`, `symbol`, `decimals`, `totalSupply`, and `balanceOf`;
- `transfer`;
- `approve` and `allowance`;
- `transferFrom`.

There is no public mint function. The contract also has no blacklist, pause, transfer fee, tax, freeze, forced transfer, proxy, or upgrade mechanism.

## Ownership and privileges

The contract does not use `Ownable` or `AccessControl`. The deployment account receives the initial supply but receives no special contract privileges. It has the same token functions as every other holder and cannot create more tokens or alter another holder's balance.

## Repository structure

```text
.
├── README.md
├── .gitignore
├── .nvmrc
├── code/
│   └── TokenizerToken.sol
├── documentation/
│   ├── README.md
│   ├── usage.md
│   ├── deployment.md
│   ├── security.md
│   └── evaluation-checklist.md
└── deployment/
    ├── README.md
    ├── hardhat.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── parameters.example.json
    ├── public-deployment.template.json
    ├── ignition/modules/TokenizerToken.ts
    ├── scripts/inspect-token.ts
    ├── scripts/transfer-token.ts
    └── test/TokenizerToken.ts
```

The authoritative evaluated source is `code/TokenizerToken.sol`. Hardhat 3 requires source files to stay inside the Hardhat project, so the deployment scripts automatically synchronize it to `deployment/contracts/TokenizerToken.sol` before compilation, tests, local-node startup, and deployment. Edit only the file in `code/`; the deployment copy is reproducible.

Generated dependencies and output (`node_modules`, `artifacts`, `cache`, deployment journals), secrets, nested Git data, and video files are excluded from the submission.

## Install, compile, and test

Node.js 22 or later is required.

```bash
nvm use
cd deployment
npm install
npm run compile
npm test
```

The tests cover:

- name, ticker, decimals, supply, and deployer balance;
- transfer and `Transfer` event;
- approval, allowance, and `transferFrom`;
- zero initial supply;
- insufficient balance;
- zero-address receiver;
- insufficient allowance.

## Local deployment

Start a persistent local node:

```bash
cd deployment
npm run node
```

In another terminal:

```bash
cd deployment
npm run deploy:local
```

A local Hardhat address is only for development and must not be recorded as the mandatory public deployment.

## BNB Smart Chain Testnet deployment

Store the RPC endpoint and the private key of a dedicated test-only account in the Hardhat keystore:

```bash
cd deployment
npx hardhat keystore set BSC_TESTNET_RPC_URL
npx hardhat keystore set BSC_TESTNET_PRIVATE_KEY
```

Deploy:

```bash
npm run deploy:bsc-testnet
```

No private key, RPC credential, password, API key, seed phrase, or populated `.env` file may be committed.

## Inspect and demonstrate the deployed token

```bash
TOKEN_ADDRESS=0x... npm run inspect:bsc-testnet
```

Send a small testnet transfer:

```bash
TOKEN_ADDRESS=0x... \
RECIPIENT_ADDRESS=0x... \
TOKEN_AMOUNT=1 \
npm run transfer:bsc-testnet
```

Open the resulting contract and transaction on BscScan Testnet. Show the `TK42` ticker, total supply, balances, transaction status, and `Transfer` event.

## Public deployment record

This table must be completed with real values after a successful public testnet deployment. No public deployment data was present in the supplied archive, so no address has been invented here.

| Field | Value |
|---|---|
| Network | BNB Smart Chain Testnet |
| Chain ID | `97` |
| Contract address | `ADD_AFTER_PUBLIC_DEPLOYMENT` |
| Explorer contract page | `ADD_AFTER_PUBLIC_DEPLOYMENT` |
| Deployment transaction | `ADD_AFTER_PUBLIC_DEPLOYMENT` |
| Deployer public address | `ADD_AFTER_PUBLIC_DEPLOYMENT` |
| Deployment date | `YYYY-MM-DD` |
| Token name shown by explorer | `Tokenizer42` |
| Ticker shown by explorer | `TK42` |

After deployment, also copy `deployment/public-deployment.template.json` to `deployment/public-deployment.json` and replace every placeholder.

## Multisig bonus

A multisignature system is not implemented in this archive. The bonus should be attempted only after the mandatory contract, documentation, error handling, public deployment, explorer record, and testnet demonstration are complete and working.

## License

The contract uses the MIT SPDX license identifier. Dependencies remain subject to their own licenses.
