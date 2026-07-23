# Security and privilege model

## Ownership

The contract does not inherit `Ownable`, `AccessControl`, or another administrator system. There is no contract owner and no privileged role.

The deployment account receives the initial token supply. This makes it the first holder, not an administrator. It cannot mint additional tokens, freeze accounts, confiscate balances, pause transfers, replace the contract logic, or change the name and ticker.

## Supply

The only `_mint` call is in the constructor. Deployment with zero supply is rejected by `TokenizerTokenZeroInitialSupply`. After deployment, the contract exposes no mint function, so the total supply cannot increase.

## Standard ERC-20 protections

OpenZeppelin's ERC20 logic rejects, among other invalid operations:

- a transfer greater than the sender's balance;
- a transfer to the zero address;
- `transferFrom` greater than the approved allowance;
- approvals involving an invalid spender.

The automated tests exercise the most important success and failure paths.

## Allowance warning

An approval authorizes another account or contract to spend up to the approved amount. Users should approve only trusted spenders and only the amount needed. To revoke access, set the allowance to zero.

## Secret handling

The repository must never contain:

- a private key or seed phrase;
- an RPC credential or API key;
- a password;
- a populated `.env` file;
- wallet exports or keystore files.

Hardhat configuration variables are stored locally with `hardhat keystore`. If a secret was ever committed, deleting the file is not sufficient: remove it from history and rotate the secret.

## Scope

Tokenizer42 is an educational testnet contract. It has not been presented as audited production software and has no monetary promise or investment purpose.
