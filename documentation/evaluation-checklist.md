# Evaluation checklist

## Repository preliminaries

- [ ] Token name is `Tokenizer42` and contains `42`.
- [ ] Root `README.md` exists.
- [ ] `code` is non-empty.
- [ ] `documentation` is non-empty.
- [ ] `deployment` is non-empty and is the deployment workspace.
- [ ] No video file is committed; at most one external video link may be used.
- [ ] No `.git`, `node_modules`, `artifacts`, `cache`, or secret file is committed.

## Mandatory review

- [ ] Platform and language choices are explained.
- [ ] Contract source is commented and uses explicit names.
- [ ] Documentation explains every supported token action.
- [ ] Ownership and privileges can be explained.
- [ ] Tests pass, including invalid usage.
- [ ] Deployment uses protected configuration variables.
- [ ] Public BNB Smart Chain Testnet deployment succeeds.
- [ ] Real contract address, transaction, network, and explorer page are recorded.
- [ ] BscScan displays `Tokenizer42` and `TK42`.
- [ ] A real testnet transfer can be demonstrated.

## Bonus

Multisig is not included in this archive. It should be attempted only after every mandatory item above is complete and working.
