# Tokenizer42 documentation

Tokenizer42 (`TK42`) is an educational fixed-supply token for the 42 Tokenizer project. It uses OpenZeppelin's ERC20 implementation and is designed for BNB Smart Chain Testnet, where the ERC-20 interface is BEP-20 compatible.

The contract creates all tokens once during deployment and assigns them to the deployment account. It has no owner-only functions, administrator roles, post-deployment minting, blacklist, pause, fee, tax, upgrade, or forced-transfer feature.

Documentation files:

- [`usage.md`](usage.md): token actions and evaluator demonstration;
- [`deployment.md`](deployment.md): local and public testnet deployment;
- [`security.md`](security.md): ownership, privileges, failures, and secret handling;
- [`evaluation-checklist.md`](evaluation-checklist.md): final repository and defense checks.
