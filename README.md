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

```bash
ACTION=info \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=network \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=accounts \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=balances \
npx hardhat run scripts/erc20-cli.ts --network localhost
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

---

# Version française

# Tokenizer42

> Un projet Tokenizer de 42 qui implémente, teste et déploie un jeton fongible sur le réseau de test BNB Smart Chain.

## Présentation générale

Tokenizer42 est un projet Web3 pédagogique réalisé dans le cadre du sujet **42 Tokenizer**. Il présente le cycle de vie complet d’un jeton blockchain :

- implémentation du contrat du jeton en Solidity ;
- compilation et test avec Hardhat 3 ;
- déploiement en local et sur un réseau de test public ;
- publication de l’adresse du contrat sur un explorateur de blockchain ;
- démonstration des opérations standard d’un jeton, telles que les transferts et les autorisations ;
- conservation des identifiants de déploiement en dehors du dépôt.

Le jeton est déployé uniquement sur le **réseau de test BNB Smart Chain**. Les BNB de test et les TK42 n’ont aucune valeur monétaire réelle.

## Déploiement public

| Propriété | Valeur |
|---|---|
| Nom du jeton | `Tokenizer42` |
| Symbole | `TK42` |
| Standard | Jeton fongible compatible BEP-20 / ERC-20 |
| Réseau | Réseau de test BNB Smart Chain |
| ID de chaîne | `97` |
| Décimales | `18` |
| Offre initiale | `1,000,000 TK42` |
| Adresse du contrat | `0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720` |
| Explorateur | [Voir le contrat sur BscScan Testnet](https://testnet.bscscan.com/address/0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720) |

| Deuxième contrat | (https://testnet.bscscan.com/address/0x2516bF8448f8333e1DB273626Cf646cC739d0724)

## Choix de conception

### Pourquoi le nom Tokenizer42 ?

Le sujet exige que le nom du jeton contienne `42`. **Tokenizer42** permet d’identifier directement le projet et son objectif pédagogique, tandis que `TK42` fournit un symbole court et facilement reconnaissable.

### Pourquoi le réseau de test BNB Smart Chain ?

BNB Smart Chain a été choisi parce qu’il prend en charge les contrats intelligents EVM et les standards de jetons compatibles avec ERC-20. Le réseau de test permet de déployer et de présenter publiquement le contrat sans utiliser d’argent réel.

### Pourquoi Solidity ?

Solidity est le principal langage de programmation de contrats intelligents pour les réseaux compatibles avec l’EVM. Il fournit les fonctionnalités du langage et l’écosystème nécessaires à l’implémentation d’un jeton fongible standard.

### Pourquoi Hardhat 3 ?

Hardhat est utilisé comme environnement de développement et de déploiement, car il fournit :

- la compilation du code Solidity ;
- des tests automatisés ;
- un nœud blockchain local ;
- des interactions scriptées avec les contrats ;
- les déploiements Hardhat Ignition ;
- des variables de configuration chiffrées grâce au keystore de Hardhat.

### Objectif du jeton

TK42 est un jeton de démonstration créé afin de valider le comportement standard d’un jeton fongible. Il n’est pas présenté comme une monnaie, un investissement, une participation dans une entreprise ou un droit sur des actifs du monde réel.

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
│   └── package.json
└── documentation/
```

La source Solidity de référence est :

```text
code/TokenizerToken.sol
```

Hardhat ne peut pas compiler un fichier source Solidity situé en dehors du répertoire de son projet. L’espace de travail de déploiement synchronise donc la source de référence dans :

```text
deployment/contracts/TokenizerToken.sol
```

Ne modifiez pas directement la copie synchronisée.

## Prérequis

Installez les outils suivants avant d’exécuter le projet :

- Node.js et npm ;
- Git ;
- MetaMask ou un autre portefeuille compatible avec l’EVM ;
- un compte dédié alimenté uniquement en BNB de test pour le déploiement public.

Aucune cryptomonnaie réelle n’est nécessaire.

## Installation

```bash
cd deployment
npm install
```

Vérifiez que l’installation locale de Hardhat est disponible :

```bash
npx hardhat --version
```

Utilisez `npx hardhat` et non une commande `hardhat` installée globalement.

## Synchronisation du contrat

Synchronisez manuellement le contrat de référence avec :

```bash
npm run sync:contract
```

Les scripts habituels de compilation, de test, de lancement du nœud local et de déploiement le synchronisent automatiquement.

## Compilation et tests

```bash
npm run compile
npm test
```

Les tests doivent couvrir les métadonnées du jeton et les principales opérations d’un jeton fongible :

- `name`, `symbol`, `decimals`, `totalSupply` et `balanceOf` ;
- `transfer` ;
- `approve` et `allowance` ;
- `transferFrom`.

## Déploiement local

Démarrez un nœud Hardhat local :

```bash
npm run node
```

Laissez-le fonctionner. Dans un deuxième terminal :

```bash
cd deployment
npm run deploy:local
```

```bash
ACTION=info \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=network \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=accounts \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

```bash
ACTION=balances \
npx hardhat run scripts/erc20-cli.ts --network localhost
```

Ce flux de travail local doit être terminé avant le déploiement sur un réseau de test public.

## Configuration du réseau de test BNB Smart Chain

### 1. Préparer un portefeuille réservé aux tests

Utilisez un compte MetaMask dédié ne contenant aucun actif réel. Alimentez-le uniquement en BNB de test.

### 2. Stocker les secrets dans le keystore de Hardhat

Utilisez ces commandes pour configurer manuellement les secrets ou enregistrez-les dans le fichier `.env`. Dans ce projet, j’utilise un fichier `.env`.

```bash
cd deployment
npx hardhat keystore set BSC_TESTNET_RPC_URL
npx hardhat keystore set BSC_TESTNET_PRIVATE_KEY
```

Saisissez le point de terminaison RPC comme premier secret, puis la clé privée du compte dédié au réseau de test comme second secret.

Ne placez jamais une clé d’API RPC, une clé privée, un mot de passe de portefeuille ou une phrase de récupération dans le code source, dans un fichier `.env` suivi par Git, dans des captures d’écran du terminal ou dans la documentation du projet.

### 3. Vérifier les noms des variables enregistrées

```bash
npx hardhat keystore list
```

La liste doit contenir :

```text
BSC_TESTNET_RPC_URL
BSC_TESTNET_PRIVATE_KEY
```

La commande affiche les noms des variables, et non leurs valeurs secrètes.

## Déploiement sur le réseau de test public

Déployez avec l’offre initiale par défaut :

```bash
npm run deploy:bsc-testnet
```

Pour fournir des paramètres Ignition personnalisés :

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet \
```

Déployez un deuxième contrat avec une offre différente. Utilisez les commandes ci-dessous pour créer ce contrat : https://testnet.bscscan.com/address/0x2516bF8448f8333e1DB273626Cf646cC739d0724

```bash
npx hardhat ignition deploy ignition/modules/TokenizerToken.ts \
  --network bscTestnet \
  --parameters parameters.example.json \
  --deployment-id bsc-testnet-custom-supply
```

## Examiner le jeton déployé

```bash
TOKEN_ADDRESS=0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720 \
npm run inspect:bsc-testnet
```

L’inspection doit afficher le nom du jeton, son symbole, le nombre de décimales, l’offre totale et le solde du compte de déploiement.

## Effectuer une démonstration de transfert

Utilisez une adresse destinataire différente de celle du compte de déploiement afin que la modification du solde soit visible :

```bash
TOKEN_ADDRESS=0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720 \
RECIPIENT_ADDRESS=0xRECIPIENT_ADDRESS \
TOKEN_AMOUNT=1 \
npm run transfer:bsc-testnet
```

```bash
TOKEN_ADDRESS=0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720 \
RECIPIENT_ADDRESS=0x2516bF8448f8333e1DB273626Cf646cC739d0724 \
TOKEN_AMOUNT=1 \
npm run transfer:bsc-testnet
```

La commande renvoie le hash d’une transaction. Ouvrez ce hash sur BscScan Testnet pour vérifier le statut de la transaction et l’événement `Transfer` émis.

## Démonstration ERC-20/BEP-20 en ligne de commande

Le script réutilisable `deployment/scripts/erc20-cli.ts` prend en charge les actions suivantes :

```text
info
transfer
approve
allowance
transferFrom
```

Définissez les adresses publiques utilisées par les commandes :

```bash
export TOKEN_ADDRESS="0x9523319bf49D550ADe54475d3d7Ea56B5C2eE720"
export OWNER_ADDRESS="0x5784aaaBB5BFf17659aC3dEC9d7d97E9E3010395"
export RECIPIENT_ADDRESS="0x2516bF8448f8333e1DB273626Cf646cC739d0724"
```

### Lire les métadonnées du jeton et le solde d’un compte

```bash
ACTION=info \
ACCOUNT_ADDRESS="$OWNER_ADDRESS" \
npx hardhat run scripts/erc20-cli.ts --network bscTestnet
```

### Transférer des jetons

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

## Principes de sécurité

- Utilisez uniquement des réseaux de test pour ce projet.
- Utilisez un portefeuille de déploiement dédié ne contenant aucun actif réel.
- Ne validez jamais dans Git des clés privées, des phrases de récupération, des mots de passe, des clés d’API ou des fichiers de keystore.
- N’exposez jamais de secrets dans des captures d’écran, l’historique du terminal, la documentation ou les rapports de problèmes.
- Vérifiez les adresses et les montants avant de soumettre une transaction.
- Examinez les mécanismes de propriété et les fonctions privilégiées avant le déploiement.
- Conservez les dépendances et les artefacts générés en dehors du dépôt, sauf s’ils sont explicitement requis.

Un fichier `.gitignore` courant doit au minimum exclure :

```gitignore
node_modules/
.env
artifacts/
cache/
ignition/deployments/
*.log
```

Les adresses publiques de contrats et les hash de transactions peuvent être publiés sans danger. Les clés privées des portefeuilles et les phrases de récupération ne le peuvent pas.

## Liste de contrôle pour l’évaluation

- [x] Le nom du jeton contient `42`.
- [x] Le code source Solidity est stocké dans `code/`.
- [x] Les outils de déploiement sont séparés dans `deployment/`.
- [x] La documentation du projet est stockée dans `documentation/`.
- [x] Le jeton respecte le standard de jeton fongible utilisé par BNB Smart Chain.
- [x] Le contrat peut être compilé et testé localement.
- [x] Les opérations minimales du jeton peuvent être démontrées depuis le terminal.
- [x] Le jeton est déployé sur une blockchain de test publique.
- [x] Le réseau et l’adresse publique du contrat sont documentés.
- [x] Aucun argent réel n’est nécessaire.
- [ ] Bonus multisignature facultatif, lorsqu’il sera implémenté et documenté.

## Piste pour le bonus

Le bonus facultatif du sujet propose d’adapter un mécanisme multisignature à l’implémentation obligatoire. Il ne doit être tenté qu’après avoir obtenu un projet obligatoire complet, stable, testé, documenté et présentable.

## Avertissement

Tokenizer42 est un projet pédagogique déployé sur un réseau de test. TK42 ne possède aucune valeur, utilité, droit de propriété ou garantie financière. Aucun élément de ce dépôt ne constitue un conseil financier ou un conseil en investissement.
