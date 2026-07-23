# Using Tokenizer42

## Token identity

| Item | Value |
|---|---|
| Name | `Tokenizer42` |
| Ticker | `TK42` |
| Decimals | `18` |
| Default initial supply | `1,000,000 TK42` |
| Supply model | Fixed after deployment |
| Target network | BNB Smart Chain Testnet |

Amounts passed to the contract use the smallest unit. One displayed TK42 is `10^18` smallest units.

## Read actions

- `name()` returns `Tokenizer42`.
- `symbol()` returns `TK42`.
- `decimals()` returns `18`.
- `totalSupply()` returns the complete minted supply.
- `balanceOf(account)` returns an account's balance.
- `allowance(owner, spender)` returns the amount a spender may use.

## Write actions

- `transfer(to, amount)` moves the caller's tokens.
- `approve(spender, amount)` sets an allowance.
- `transferFrom(from, to, amount)` moves tokens using an allowance.

Every successful transfer emits the standard `Transfer` event. Every standard approval emits the `Approval` event.

## Minimal defense demonstration

1. Open the contract address on BscScan Testnet.
2. Show network chain ID `97`, token name `Tokenizer42`, and ticker `TK42`.
3. Show the total supply and the deployment account's balance.
4. Read `name`, `symbol`, `decimals`, `totalSupply`, and `balanceOf`.
5. Send a small TK42 transfer to a second test address.
6. Open the transaction and explain its status, block, sender, recipient, amount, and `Transfer` event.
7. Show the recipient's new token balance.
8. Explain that the deployer received the supply but has no special contract privilege.

The scripts in `deployment/scripts` can inspect the token and perform the transfer. They validate addresses and amounts before sending a transaction.
