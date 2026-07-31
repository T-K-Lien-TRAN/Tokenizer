# Tokenizer42

> A 42 Tokenizer project that implements, tests, deploys, and demonstrates a fixed-supply fungible token on BNB Smart Chain Testnet.

## Overview

Tokenizer42 is an educational Web3 project created for the **42 Tokenizer** subject. It demonstrates the complete lifecycle of a blockchain token:

- implementing a fungible-token smart contract in Solidity;
- compiling and testing it with Hardhat 3;
- deploying it on a local blockchain and on a public test network;
- publishing its ticker, network, contract address, and deployment transaction;
- demonstrating transfers, balances, approvals, allowances, and delegated transfers;
- documenting the security model and keeping deployment secrets outside the repository.

The public deployment uses **BNB Smart Chain Testnet**. Testnet BNB and TK42 have no real monetary value.

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
| Deployer | `0x5784aaaBB5BFf17659aC3dEC9d7d97E9E3010395` |
| Contract address | `0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720` |
| Deployment transaction | `0x92b1b350795d96921b8c382ab2c2d8ec4b8030debc60e2d8fd5bc1930f0b4daf` |
| Deployment block | `121008384` |
| Contract explorer | [View the contract on BscScan Testnet](https://testnet.bscscan.com/address/0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720) |
| Transaction explorer | [View the deployment transaction](https://testnet.bscscan.com/tx/0x92b1b350795d96921b8c382ab2c2d8ec4b8030debc60e2d8fd5bc1930f0b4daf) |
| Second Contract explorer | [View the contract on BscScan Testnet](https://testnet.bscscan.com/address/0xDFa198b1F9fD54A69597b9a3043AdDfaC673e386) |

## Design choices

### Why the name Tokenizer42?

The subject requires the token name to contain `42`. **Tokenizer42** identifies both the project and its educational context, while `TK42` is a short and recognizable ticker.

### Why BNB Smart Chain Testnet?

BNB Smart Chain supports EVM smart contracts and fungible-token interfaces compatible with ERC-20. Its testnet makes it possible to deploy and demonstrate the contract publicly without using real money.

### Why Solidity?

Solidity is the main smart-contract language used by EVM-compatible networks. It provides the language features and ecosystem required to implement a standard fungible token.

### Why OpenZeppelin ERC20?

The contract inherits from OpenZeppelin's audited and widely used `ERC20` implementation instead of reimplementing the standard manually. This provides the expected token functions and events, including:

- `totalSupply` and `balanceOf`;
- `transfer`;
- `approve` and `allowance`;
- `transferFrom`;
- `Transfer` and `Approval` events.

### Why Hardhat 3?

Hardhat is used as the development and deployment environment because it provides:

- Solidity compilation;
- automated tests;
- a local blockchain node;
- TypeScript scripts for interacting with contracts;
- repeatable Hardhat Ignition deployments;
- encrypted configuration variables through the Hardhat keystore.

### Token purpose

TK42 is a demonstration token created to validate standard fungible-token behavior. It is not presented as money, an investment, company equity, or a claim on real-world assets.

## Token and security model

The contract has a deliberately small attack surface:

- the complete supply is minted once to the deployment account;
- the initial supply must be greater than zero;
- no tokens can be minted after deployment;
- there is no owner or administrator role;
- there is no pause, blacklist, fee, upgrade, or privileged transfer mechanism;
- token transfers and allowances follow the inherited OpenZeppelin ERC-20 behavior.

Because the contract has no administrative role, losing the deployer's key does not give another account control over the contract. It would, however, make the tokens held by that account inaccessible. Deployment keys must therefore still be handled securely.

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
│   ├── package.json
│   ├── package-lock.json
│   └── parameters.example.json
└── documentation/
    ├── README.md
    ├── deployment.md
    ├── evaluation-checklist.md
    ├── security.md
    └── usage.md
```

The authoritative Solidity source is:

```text
code/TokenizerToken.sol
```

Hardhat compiles files from its own `deployment/contracts/` directory. Before compilation or deployment, the synchronization script copies the authoritative source to:

```text
deployment/contracts/TokenizerToken.sol
```

Do not edit the synchronized copy directly.

## Prerequisites

Install or prepare:

- Node.js `22` or later;
- npm;
- Git;
- MetaMask or another EVM-compatible wallet;
- a dedicated account funded only with testnet BNB for public deployment.

No real cryptocurrency is required.

## Installation

From the repository root:

```bash
cd deployment
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

Confirm that the local Hardhat installation is available:

```bash
npx hardhat --version
```

Use `npx hardhat` or the provided npm scripts rather than a globally installed `hardhat` command.

## Contract synchronization

Synchronize the authoritative contract manually with:

```bash
npm run sync:contract
```

The compile, test, local-node, and deployment npm scripts perform this synchronization automatically.

## Compile, type-check, and test

```bash
npm run compile
npm run typecheck
npm test
```

The automated test suite verifies:

- the name, ticker, decimals, total supply, and initial deployer balance;
- one-time minting of the complete supply to the deployer;
- transfers and the standard `Transfer` event;
- approvals, allowances, and `transferFrom`;
- rejection of a zero initial supply;
- rejection of transfers above the sender's balance;
- rejection of transfers to the zero address;
- rejection of `transferFrom` when the allowance is insufficient.

## Local deployment

All commands in this section are run from `deployment/`.

### 1. Start a local Hardhat node

```bash
npm run node
```

Keep this terminal running.

### 2. Deploy in another terminal

```bash
cd deployment
npm run deploy:local
```

On a fresh Hardhat node, the first Ignition deployment normally creates the token at:

```text
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

The CLI uses this as its default localhost token address. Set `TOKEN_ADDRESS` or `LOCALHOST_TOKEN_ADDRESS` when your local deployment uses another address.

### 3. Inspect the local network and token

```bash
ACTION=accounts \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=network \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=info \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=balances \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

Complete this local workflow before deploying to a public test network.

### 4. Demonstrate `approve` and `transferFrom` on localhost

The delegated-transfer workflow uses three different local Hardhat accounts:

- **owner / signer 0**: owns the TK42 tokens and grants an allowance;
- **spender / signer 1**: receives permission and calls `transferFrom`;
- **recipient / account 2**: receives the transferred tokens.

On a fresh Hardhat node, define the token and account addresses:

```bash
export TOKEN_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
export OWNER_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
export SPENDER_ADDRESS="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
export RECIPIENT_ADDRESS="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
```

#### Approve the spender

The owner uses signer 0 to authorize the spender to spend up to `5 TK42`:

```bash
SIGNER_INDEX=0 \
ACTION=approve \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
TOKEN_AMOUNT="5" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

`approve` records an allowance from the owner to the spender. It does not transfer any tokens. It sets the allowance to the supplied amount rather than adding to the previous allowance.

#### Check the allowance

```bash
ACTION=allowance \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

The expected allowance after the approval is:

```text
5.0 TK42
```

#### Execute `transferFrom`

The spender uses signer 1 to transfer `1 TK42` from the owner to the recipient:

```bash
SIGNER_INDEX=1 \
ACTION=transferFrom \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
FROM_ADDRESS="$OWNER_ADDRESS" \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
TOKEN_AMOUNT="1" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

`transferFrom` succeeds only when:

- the caller is the approved spender;
- the owner's balance is sufficient;
- the remaining allowance is at least the requested amount.

After this transaction:

- the owner's balance decreases by `1 TK42`;
- the recipient's balance increases by `1 TK42`;
- the remaining allowance decreases from `5 TK42` to `4 TK42`;
- the spender's own token balance does not change unless the spender is also the recipient.

#### Verify the updated allowance and balances

```bash
ACTION=allowance \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=balances \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

The important distinction is that `approve` is sent by the token owner with `SIGNER_INDEX=0`, while `transferFrom` is sent by the approved spender with `SIGNER_INDEX=1`.

## BNB Smart Chain Testnet configuration

### 1. Prepare a test-only wallet

Use a dedicated account containing no real assets and fund it only with testnet BNB.
https://metamask.io/->GETSTARTED

### 2. Recommended method: Hardhat keystore

From `deployment/`, save the RPC endpoint and testnet private key in the encrypted Hardhat keystore:

```bash
npx hardhat keystore set BSC_TESTNET_RPC_URL
npx hardhat keystore set BSC_TESTNET_PRIVATE_KEY
```

Verify the stored variable names:

```bash
npx hardhat keystore list
```

The list should include:

```text
BSC_TESTNET_RPC_URL
BSC_TESTNET_PRIVATE_KEY
```

The command displays variable names, not their secret values.

### 3. Alternative method: local `.env` file

The project also loads local environment variables through `dotenv`. Copy the example file and replace only the placeholder values:

```bash
cp ../.env.example .env
```

The file must contain:

```dotenv
BSC_TESTNET_RPC_URL=https://your-bsc-testnet-rpc.example
BSC_TESTNET_PRIVATE_KEY=0xYOUR_TESTNET_PRIVATE_KEY
```

The `.env` file is local-only and must never be committed, uploaded, archived, or shared. Never expose a private key, recovery phrase, wallet password, or RPC API key in source code, documentation, screenshots, shell history, or issue reports.

## Public testnet deployment

Deploy with the default supply of `1,000,000 TK42`:

```bash
npm run deploy:bsc-testnet
```

Equivalent direct command:

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet
```

### Optional custom initial supply

`parameters.example.json` currently contains the same `1,000,000 TK42` supply as the default deployment. To deploy a genuinely different supply:

1. change its `initialSupply` value in the token's smallest unit;
2. use a unique deployment ID so that Ignition does not reconcile it with the existing deployment.

Example:

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet \
  --parameters parameters.example.json \
  --deployment-id bsc-testnet-custom-supply
```
(https://testnet.bscscan.com/address/0x2516bF8448f8333e1DB273626Cf646cC739d0724)

With 18 decimals, the smallest-unit value is calculated as:

```text
human-readable token amount × 10^18
```

For example, `1,000,000 TK42` is:

```text
1000000000000000000000000
```

A second deployment is not required by the mandatory subject.


## ERC-20/BEP-20 command-line interface

The reusable script `deployment/scripts/erc20-cli.ts` supports:

```text
accounts
network
info
name
symbol
decimals
totalSupply
balanceOf
balances
transfer
approve
allowance
transferFrom
```

A meaningful `approve` and `transferFrom` demonstration uses three roles:

- **owner**: owns the tokens and grants an allowance;
- **spender**: receives permission and calls `transferFrom`;
- **recipient**: receives the transferred tokens.

Create the second MetaMask account: TK42 Recipient (moz-extension://e1f46f77-0f61-473f-b6d5-48ab5ab85589/home.html#/)
(https://testnet.bscscan.com/address/0xDFa198b1F9fD54A69597b9a3043AdDfaC673e386)

Define the public addresses used by the commands:

```bash
export TOKEN_ADDRESS="0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720"
export OWNER_ADDRESS="0x5784aaaBB5BFf17659aC3dEC9d7d97E9E3010395"
export RECIPIENT_ADDRESS="0xDFa198b1F9fD54A69597b9a3043AdDfaC673e386"
```

### Read token metadata and an account balance

```bash
ACTION=info \
ACCOUNT_ADDRESS="$OWNER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

### Demonstrate a public testnet token transfer

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

## Security rules

- Use only test networks for this project.
- Use a dedicated deployment wallet containing no real assets.
- Never commit or share `.env`, private keys, seed phrases, passwords, RPC API keys, or keystore files.
- Treat a private key included in an archive or message as compromised and replace that test account.
- Verify the network, contract address, recipient, amount, owner, spender, and signer index before sending a transaction.
- Do not commit generated dependencies, build output, or Ignition deployment journals unless explicitly required.
- Keep `package-lock.json` to preserve reproducible dependencies.

A suitable root `.gitignore` should include:

```gitignore
node_modules/
artifacts/
cache/
types/
coverage/
ignition/deployments/
.env
.env.*
!.env.example
*.log
```

The `!.env.example` exception allows the placeholder template to remain tracked while all real `.env` variants stay ignored.

Public contract addresses, transaction hashes, and block numbers may be documented. Private keys and recovery phrases must never be published.

## Evaluation checklist

- [x] The token name contains `42`.
- [x] The authoritative Solidity source is stored in the root `code/` folder.
- [x] Deployment and interaction tools are separated in `deployment/`.
- [x] Project documentation is stored in the root `documentation/` folder.
- [x] The contract follows the ERC-20 interface used by BEP-20 tokens on BNB Smart Chain.
- [x] The code uses readable names and explanatory comments.
- [x] The contract can be compiled, type-checked, and tested locally.
- [x] Minimal token actions can be demonstrated from the terminal.
- [x] Ownership and privileged operations are explicitly documented.
- [x] The token is deployed on a public test blockchain.
- [x] The network, ticker, contract address, transaction hash, and block are documented.
- [x] No real money is required.
- [ ] Optional multisignature bonus, when implemented and documented.


## Disclaimer

Tokenizer42 is an educational testnet project. TK42 has no guaranteed value, utility, ownership rights, or financial backing. Nothing in this repository is financial or investment advice.

---

# Version française

# Tokenizer42

> Un projet Tokenizer de 42 qui implémente, teste, déploie et présente un jeton fongible à offre fixe sur le réseau de test BNB Smart Chain.

## Présentation générale

Tokenizer42 est un projet Web3 pédagogique réalisé dans le cadre du sujet **42 Tokenizer**. Il présente le cycle de vie complet d’un jeton blockchain :

- implémentation d’un contrat de jeton fongible en Solidity ;
- compilation et tests avec Hardhat 3 ;
- déploiement sur une blockchain locale et sur un réseau de test public ;
- publication du symbole, du réseau, de l’adresse du contrat et de la transaction de déploiement ;
- démonstration des transferts, soldes, approbations, autorisations et transferts délégués ;
- documentation du modèle de sécurité et conservation des secrets hors du dépôt.

Le déploiement public utilise le **réseau de test BNB Smart Chain**. Les BNB de test et les TK42 n’ont aucune valeur monétaire réelle.

## Déploiement public

| Propriété | Valeur |
|---|---|
| Nom du jeton | `Tokenizer42` |
| Symbole | `TK42` |
| Standard | Jeton fongible compatible BEP-20 / ERC-20 |
| Réseau | Réseau de test BNB Smart Chain |
| ID de chaîne | `97` |
| Décimales | `18` |
| Offre initiale | `1 000 000 TK42` |
| Compte de déploiement | `0x5784aaaBB5BFf17659aC3dEC9d7d97E9E3010395` |
| Adresse du contrat | `0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720` |
| Transaction de déploiement | `0x92b1b350795d96921b8c382ab2c2d8ec4b8030debc60e2d8fd5bc1930f0b4daf` |
| Bloc de déploiement | `121008384` |
| Explorateur du contrat | [Voir le contrat sur BscScan Testnet](https://testnet.bscscan.com/address/0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720) |
| Explorateur de la transaction | [Voir la transaction de déploiement](https://testnet.bscscan.com/tx/0x92b1b350795d96921b8c382ab2c2d8ec4b8030debc60e2d8fd5bc1930f0b4daf) |
| Explorateur du deuxieme contrat | [View the contract on BscScan Testnet](https://testnet.bscscan.com/address/0xDFa198b1F9fD54A69597b9a3043AdDfaC673e386) |

## Choix de conception

### Pourquoi le nom Tokenizer42 ?

Le sujet exige que le nom du jeton contienne `42`. **Tokenizer42** identifie le projet et son contexte pédagogique, tandis que `TK42` est un symbole court et facilement reconnaissable.

### Pourquoi le réseau de test BNB Smart Chain ?

BNB Smart Chain prend en charge les contrats intelligents EVM et les interfaces de jetons fongibles compatibles avec ERC-20. Son réseau de test permet de déployer et de présenter publiquement le contrat sans utiliser d’argent réel.

### Pourquoi Solidity ?

Solidity est le principal langage de contrats intelligents utilisé sur les réseaux compatibles avec l’EVM. Il fournit les fonctionnalités et l’écosystème nécessaires à l’implémentation d’un jeton fongible standard.

### Pourquoi OpenZeppelin ERC20 ?

Le contrat hérite de l’implémentation `ERC20` d’OpenZeppelin, largement utilisée et auditée, plutôt que de réimplémenter manuellement le standard. Elle fournit les fonctions et événements attendus, notamment :

- `totalSupply` et `balanceOf` ;
- `transfer` ;
- `approve` et `allowance` ;
- `transferFrom` ;
- les événements `Transfer` et `Approval`.

### Pourquoi Hardhat 3 ?

Hardhat est utilisé comme environnement de développement et de déploiement, car il fournit :

- la compilation du code Solidity ;
- des tests automatisés ;
- un nœud blockchain local ;
- des scripts TypeScript pour interagir avec les contrats ;
- des déploiements reproductibles avec Hardhat Ignition ;
- des variables de configuration chiffrées grâce au keystore Hardhat.

### Objectif du jeton

TK42 est un jeton de démonstration créé pour valider le comportement standard d’un jeton fongible. Il n’est pas présenté comme une monnaie, un investissement, une participation dans une entreprise ou un droit sur des actifs du monde réel.

## Modèle du jeton et de sécurité

Le contrat possède volontairement une surface d’attaque réduite :

- la totalité de l’offre est créée une seule fois pour le compte de déploiement ;
- l’offre initiale doit être supérieure à zéro ;
- aucun jeton ne peut être créé après le déploiement ;
- il n’existe aucun rôle de propriétaire ou d’administrateur ;
- il n’existe aucun mécanisme de pause, liste noire, frais, mise à niveau ou transfert privilégié ;
- les transferts et autorisations suivent le comportement ERC-20 hérité d’OpenZeppelin.

Comme le contrat ne possède aucun rôle administratif, la perte de la clé du compte de déploiement ne donne pas le contrôle du contrat à un autre compte. Elle rendrait néanmoins inaccessibles les jetons détenus par ce compte. Les clés de déploiement doivent donc rester protégées.

## Structure du dépôt

```text
.
├── README.md
├── code/
│   └── TokenizerToken.sol
├── deployment/
│   ├── contracts/                 # copie Hardhat synchronisée
│   ├── ignition/
│   │   └── modules/
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── parameters.example.json
└── documentation/
    ├── README.md
    ├── deployment.md
    ├── evaluation-checklist.md
    ├── security.md
    └── usage.md
```

La source Solidity de référence est :

```text
code/TokenizerToken.sol
```

Hardhat compile les fichiers contenus dans son propre répertoire `deployment/contracts/`. Avant la compilation ou le déploiement, le script de synchronisation copie la source de référence vers :

```text
deployment/contracts/TokenizerToken.sol
```

Ne modifiez pas directement la copie synchronisée.

## Prérequis

Installez ou préparez :

- Node.js `22` ou une version ultérieure ;
- npm ;
- Git ;
- MetaMask ou un autre portefeuille compatible avec l’EVM ;
- un compte dédié alimenté uniquement en BNB de test pour le déploiement public.

Aucune cryptomonnaie réelle n’est nécessaire.

## Installation

Depuis la racine du dépôt :

```bash
cd deployment
npm ci
```

`npm ci` installe les versions exactes enregistrées dans `package-lock.json`.

Vérifiez que l’installation locale de Hardhat est disponible :

```bash
npx hardhat --version
```

Utilisez `npx hardhat` ou les scripts npm fournis plutôt qu’une commande `hardhat` installée globalement.

## Synchronisation du contrat

Synchronisez manuellement le contrat de référence avec :

```bash
npm run sync:contract
```

Les scripts npm de compilation, test, lancement du nœud local et déploiement effectuent automatiquement cette synchronisation.

## Compilation, vérification des types et tests

```bash
npm run compile
npm run typecheck
npm test
```

La suite de tests automatisés vérifie :

- le nom, le symbole, les décimales, l’offre totale et le solde initial du compte de déploiement ;
- la création unique de la totalité de l’offre pour le compte de déploiement ;
- les transferts et l’événement standard `Transfer` ;
- les approbations, autorisations et `transferFrom` ;
- le rejet d’une offre initiale nulle ;
- le rejet d’un transfert supérieur au solde de l’émetteur ;
- le rejet d’un transfert vers l’adresse nulle ;
- le rejet de `transferFrom` lorsque l’autorisation est insuffisante.

## Déploiement local

Toutes les commandes de cette section sont exécutées depuis `deployment/`.

### 1. Démarrer un nœud Hardhat local

```bash
npm run node
```

Conservez ce terminal ouvert.

### 2. Déployer depuis un autre terminal

```bash
cd deployment
npm run deploy:local
```

Sur un nouveau nœud Hardhat, le premier déploiement Ignition crée normalement le jeton à l’adresse :

```text
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Le CLI utilise cette adresse par défaut sur localhost. Définissez `TOKEN_ADDRESS` ou `LOCALHOST_TOKEN_ADDRESS` si votre déploiement local utilise une autre adresse.

### 3. Examiner le réseau local et le jeton

```bash
ACTION=accounts \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=network \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=info \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=balances \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

Terminez ce flux de travail local avant de déployer sur un réseau de test public.

### 4. Démontrer `approve` et `transferFrom` sur localhost

Le transfert délégué utilise trois comptes Hardhat locaux différents :

- **propriétaire / signataire 0** : possède les TK42 et accorde une autorisation ;
- **compte dépensier / signataire 1** : reçoit l'autorisation et appelle `transferFrom` ;
- **destinataire / compte 2** : reçoit les jetons transférés.

Sur un nouveau nœud Hardhat, définissez l'adresse du contrat et les adresses des comptes :

```bash
export TOKEN_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
export OWNER_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
export SPENDER_ADDRESS="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
export RECIPIENT_ADDRESS="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
```

#### Autoriser le compte dépensier avec `approve`

Le propriétaire utilise le signataire 0 pour autoriser le compte dépensier à utiliser jusqu'à `5 TK42` :

```bash
SIGNER_INDEX=0 \
ACTION=approve \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
TOKEN_AMOUNT="5" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

`approve` enregistre une autorisation du propriétaire vers le compte dépensier. Cette fonction ne transfère aucun jeton. Elle remplace l'autorisation précédente par le montant fourni au lieu de l'additionner.

#### Vérifier l'autorisation

```bash
ACTION=allowance \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

L'autorisation attendue après l'approbation est :

```text
5.0 TK42
```

#### Exécuter `transferFrom`

Le compte dépensier utilise le signataire 1 pour transférer `1 TK42` du propriétaire vers le destinataire :

```bash
SIGNER_INDEX=1 \
ACTION=transferFrom \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
FROM_ADDRESS="$OWNER_ADDRESS" \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
TOKEN_AMOUNT="1" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

`transferFrom` réussit uniquement lorsque :

- l'appelant est le compte dépensier autorisé ;
- le solde du propriétaire est suffisant ;
- l'autorisation restante est au moins égale au montant demandé.

Après cette transaction :

- le solde du propriétaire diminue de `1 TK42` ;
- le solde du destinataire augmente de `1 TK42` ;
- l'autorisation restante diminue de `5 TK42` à `4 TK42` ;
- le solde du compte dépensier ne change pas, sauf s'il est également le destinataire.

#### Vérifier l'autorisation et les soldes mis à jour

```bash
ACTION=allowance \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=balances \
TOKEN_ADDRESS="$TOKEN_ADDRESS" \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

La distinction essentielle est que `approve` est envoyé par le propriétaire avec `SIGNER_INDEX=0`, tandis que `transferFrom` est envoyé par le compte dépensier autorisé avec `SIGNER_INDEX=1`.

## Configuration du réseau de test BNB Smart Chain

### 1. Préparer un portefeuille réservé aux tests

Utilisez un compte dédié ne contenant aucun actif réel et alimentez-le uniquement en BNB de test.
https://metamask.io/->GETSTARTED

### 2. Méthode recommandée : keystore Hardhat

Depuis `deployment/`, enregistrez le point de terminaison RPC et la clé privée de test dans le keystore chiffré de Hardhat :

```bash
npx hardhat keystore set BSC_TESTNET_RPC_URL
npx hardhat keystore set BSC_TESTNET_PRIVATE_KEY
```

Vérifiez les noms des variables enregistrées :

```bash
npx hardhat keystore list
```

La liste doit contenir :

```text
BSC_TESTNET_RPC_URL
BSC_TESTNET_PRIVATE_KEY
```

La commande affiche les noms des variables, et non leurs valeurs secrètes.

### 3. Autre méthode : fichier `.env` local

Le projet charge également les variables locales avec `dotenv`. Copiez le fichier d’exemple et remplacez uniquement les valeurs fictives :

```bash
cp ../.env.example .env
```

Le fichier doit contenir :

```dotenv
BSC_TESTNET_RPC_URL=https://your-bsc-testnet-rpc.example
BSC_TESTNET_PRIVATE_KEY=0xYOUR_TESTNET_PRIVATE_KEY
```

Le fichier `.env` est strictement local : il ne doit jamais être validé dans Git, téléversé, archivé ou partagé. N’exposez jamais une clé privée, une phrase de récupération, un mot de passe de portefeuille ou une clé d’API RPC dans le code, la documentation, les captures d’écran, l’historique du terminal ou les rapports de problèmes.

## Déploiement sur le réseau de test public

Déployez avec l’offre par défaut de `1 000 000 TK42` :

```bash
npm run deploy:bsc-testnet
```

Commande directe équivalente :

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet
```

### Offre initiale personnalisée facultative

Le fichier `parameters.example.json` contient actuellement la même offre de `1 000 000 TK42` que le déploiement par défaut. Pour déployer une offre réellement différente :

1. modifiez sa valeur `initialSupply` dans la plus petite unité du jeton ;
2. utilisez un identifiant de déploiement unique afin qu’Ignition ne tente pas de le réconcilier avec le déploiement existant.

Exemple :

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet \
  --parameters parameters.example.json \
  --deployment-id bsc-testnet-custom-supply
```
(https://testnet.bscscan.com/address/0x2516bF8448f8333e1DB273626Cf646cC739d0724)

Avec 18 décimales, la valeur dans la plus petite unité se calcule ainsi :

```text
nombre de jetons lisible × 10^18
```

Par exemple, `1 000 000 TK42` correspond à :

```text
1000000000000000000000000
```

Un second déploiement n’est pas exigé par la partie obligatoire du sujet.

## Interface en ligne de commande ERC-20/BEP-20

Le script réutilisable `deployment/scripts/erc20-cli.ts` prend en charge :

```text
accounts
network
info
name
symbol
decimals
totalSupply
balanceOf
balances
transfer
approve
allowance
transferFrom
```

Une démonstration pertinente de `approve` et `transferFrom` utilise trois rôles :

- **propriétaire** : possède les jetons et accorde une autorisation ;
- **compte dépensier** : reçoit l’autorisation et appelle `transferFrom` ;
- **destinataire** : reçoit les jetons transférés.

Créer le deuxieme MetaMask compte: TK42 Recipient (moz-extension://e1f46f77-0f61-473f-b6d5-48ab5ab85589/home.html#/)
(https://testnet.bscscan.com/address/0xDFa198b1F9fD54A69597b9a3043AdDfaC673e386)

Définissez les adresses publiques utilisées par les commandes :

```bash

export TOKEN_ADDRESS="0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720"
export OWNER_ADDRESS="0x5784aaaBB5BFf17659aC3dEC9d7d97E9E3010395"
export RECIPIENT_ADDRESS="0xDFa198b1F9fD54A69597b9a3043AdDfaC673e386"
```

### Lire les métadonnées du jeton et le solde d’un compte

```bash

ACTION=info \
ACCOUNT_ADDRESS="$OWNER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

## Démontrer un transfert des jetons sur le réseau de test public

```bash

ACTION=transfer \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
TOKEN_AMOUNT="1" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

### Autoriser un compte dépensier

```bash
export SPENDER_ADDRESS="$OWNER_ADDRESS"

ACTION=approve \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
TOKEN_AMOUNT="5" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

`approve` fixe l’autorisation au montant fourni. Cette fonction n’ajoute pas ce montant à une autorisation existante.

### Lire une autorisation

```bash
ACTION=allowance \
OWNER_ADDRESS="$OWNER_ADDRESS" \
SPENDER_ADDRESS="$SPENDER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

### Exécuter `transferFrom`

Pour effectuer une démonstration complète, configurez le compte dépensier comme premier signataire Hardhat et exécutez la commande avec l’indice de ce signataire :

```bash
SIGNER_INDEX=0 \
ACTION=transferFrom \
FROM_ADDRESS="$OWNER_ADDRESS" \
RECIPIENT_ADDRESS="$RECIPIENT_ADDRESS" \
TOKEN_AMOUNT="1" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

Un appel réussi doit :

- diminuer le solde de jetons du propriétaire ;
- augmenter le solde de jetons du destinataire ;
- diminuer l’autorisation restante du compte dépensier du montant transféré.

L’utilisation de la même adresse comme propriétaire et comme destinataire crée un auto-transfert : la transaction est valide et l’autorisation est consommée, mais le solde net de jetons du compte ne change pas.

## Règles de sécurité

- Utilisez uniquement des réseaux de test pour ce projet.
- Utilisez un portefeuille de déploiement dédié ne contenant aucun actif réel.
- Ne validez et ne partagez jamais `.env`, les clés privées, phrases de récupération, mots de passe, clés d’API RPC ou fichiers de keystore.
- Considérez comme compromise toute clé privée incluse dans une archive ou un message et remplacez ce compte de test.
- Vérifiez le réseau, l’adresse du contrat, le destinataire, le montant, le propriétaire, le compte dépensier et l’indice du signataire avant d’envoyer une transaction.
- Ne validez pas les dépendances, sorties de compilation ou journaux de déploiement Ignition générés, sauf exigence explicite.
- Conservez `package-lock.json` afin de garantir des dépendances reproductibles.

Un fichier `.gitignore` adapté à la racine doit contenir :

```gitignore
node_modules/
artifacts/
cache/
types/
coverage/
ignition/deployments/
.env
.env.*
!.env.example
*.log
```

L’exception `!.env.example` permet de conserver le modèle fictif dans Git tout en ignorant tous les véritables fichiers `.env`.

Les adresses publiques de contrats, les hash de transactions et les numéros de blocs peuvent être documentés. Les clés privées et phrases de récupération ne doivent jamais être publiées.

## Liste de contrôle pour l’évaluation

- [x] Le nom du jeton contient `42`.
- [x] La source Solidity de référence est stockée dans le dossier racine `code/`.
- [x] Les outils de déploiement et d’interaction sont séparés dans `deployment/`.
- [x] La documentation du projet est stockée dans le dossier racine `documentation/`.
- [x] Le contrat respecte l’interface ERC-20 utilisée par les jetons BEP-20 sur BNB Smart Chain.
- [x] Le code utilise des noms lisibles et des commentaires explicatifs.
- [x] Le contrat peut être compilé, vérifié par TypeScript et testé localement.
- [x] Les opérations minimales du jeton peuvent être présentées depuis le terminal.
- [x] La propriété et les opérations privilégiées sont explicitement documentées.
- [x] Le jeton est déployé sur une blockchain de test publique.
- [x] Le réseau, le symbole, l’adresse du contrat, le hash de transaction et le bloc sont documentés.
- [x] Aucun argent réel n’est nécessaire.
- [ ] Bonus multisignature facultatif, lorsqu’il sera implémenté et documenté.


## Avertissement

Tokenizer42 est un projet pédagogique déployé sur un réseau de test. TK42 ne possède aucune valeur garantie, utilité, droit de propriété ou garantie financière. Aucun élément de ce dépôt ne constitue un conseil financier ou un conseil en investissement.
