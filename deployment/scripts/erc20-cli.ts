import { network } from "hardhat";

const LOCALHOST_CHAIN_ID = 31337n;
const BSC_TESTNET_CHAIN_ID = 97n;
const DEFAULT_LOCALHOST_TOKEN_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required variable: ${name}`);
  }

  return value;
}

function parseSignerIndex(): number {
  const rawValue = process.env.SIGNER_INDEX?.trim() ?? "0";
  const signerIndex = Number(rawValue);

  if (!Number.isInteger(signerIndex) || signerIndex < 0) {
    throw new Error(
      `SIGNER_INDEX must be a non-negative integer. Received: "${rawValue}"`,
    );
  }

  return signerIndex;
}

function networkLabel(chainId: bigint): string {
  if (chainId === LOCALHOST_CHAIN_ID) {
    return "localhost";
  }

  if (chainId === BSC_TESTNET_CHAIN_ID) {
    return "bscTestnet";
  }

  return "unknown";
}

async function main(): Promise<void> {
  const { ethers } = await network.create();
  const providerNetwork = await ethers.provider.getNetwork();
  const chainId = providerNetwork.chainId;
  const currentNetwork = networkLabel(chainId);
  const action = required("ACTION");

  const signers = await ethers.getSigners();

  if (signers.length === 0) {
    throw new Error(
      `No signer is available on ${currentNetwork} (chain ID ${chainId}).`,
    );
  }

  /*
   * ACTION=accounts does not require a deployed token address.
   * It is useful for discovering the unlocked Hardhat accounts on localhost
   * or confirming which configured account is used on BSC Testnet.
   */
  if (action === "accounts") {
    console.log("Network:", currentNetwork);
    console.log("Chain ID:", chainId.toString());

    for (const [index, currentSigner] of signers.entries()) {
      console.log(`Signer ${index}:`, await currentSigner.getAddress());
    }

    return;
  }

  const signerIndex = parseSignerIndex();
  const signer = signers[signerIndex];

  if (signer === undefined) {
    throw new Error(
      `No signer exists at index ${signerIndex}. ` +
        `Available signer indexes: 0-${signers.length - 1}.`,
    );
  }

  const callerAddress = await signer.getAddress();

  /*
   * Address priority:
   *
   * 1. TOKEN_ADDRESS
   *    Explicit override that works on any network.
   *
   * 2. LOCALHOST_TOKEN_ADDRESS
   *    Optional localhost-specific address.
   *
   * 3. Default Hardhat localhost address
   *    Used when the first contract was deployed to a fresh local node.
   *
   * 4. BSC_TESTNET_TOKEN_ADDRESS
   *    Required for BSC Testnet unless TOKEN_ADDRESS is supplied.
   */
  let rawTokenAddress = process.env.TOKEN_ADDRESS?.trim();

  if (!rawTokenAddress && chainId === LOCALHOST_CHAIN_ID) {
    rawTokenAddress =
      process.env.LOCALHOST_TOKEN_ADDRESS?.trim() ??
      DEFAULT_LOCALHOST_TOKEN_ADDRESS;
  }

  if (!rawTokenAddress && chainId === BSC_TESTNET_CHAIN_ID) {
    rawTokenAddress = process.env.BSC_TESTNET_TOKEN_ADDRESS?.trim();
  }

  if (!rawTokenAddress) {
    throw new Error(
      `No token address is configured for ${currentNetwork} ` +
        `(chain ID ${chainId}). Set TOKEN_ADDRESS, or set the ` +
        `network-specific token address variable.`,
    );
  }

  const tokenAddress = ethers.getAddress(rawTokenAddress);
  const deployedCode = await ethers.provider.getCode(tokenAddress);

  if (deployedCode === "0x") {
    throw new Error(
      `No smart contract exists at ${tokenAddress} on ${currentNetwork} ` +
        `(chain ID ${chainId}). Check the selected network and token address.`,
    );
  }

  const token = await ethers.getContractAt(
    "TokenizerToken",
    tokenAddress,
    signer,
  );

  const decimals = Number(await token.decimals());
  const symbol = await token.symbol();
  const transactionConfirmations =
    chainId === BSC_TESTNET_CHAIN_ID ? 2 : 1;

  const parseAmount = (amount: string): bigint => {
    const parsedAmount = ethers.parseUnits(amount, decimals);

    if (parsedAmount <= 0n) {
      throw new Error("TOKEN_AMOUNT must be greater than zero.");
    }

    return parsedAmount;
  };

  const formatAmount = (amount: bigint): string =>
    ethers.formatUnits(amount, decimals);

  const printContext = (): void => {
    console.log("Network:", currentNetwork);
    console.log("Chain ID:", chainId.toString());
    console.log("Contract:", tokenAddress);
    console.log("Caller:", callerAddress);
    console.log("Signer index:", signerIndex);
  };

  if (action === "network") {
    printContext();
    return;
  }

  if (action === "info") {
    const account = ethers.getAddress(
      process.env.ACCOUNT_ADDRESS?.trim() ?? callerAddress,
    );

    printContext();
    console.log("Name:", await token.name());
    console.log("Symbol:", symbol);
    console.log("Decimals:", decimals);
    console.log(
      "Total supply:",
      formatAmount(await token.totalSupply()),
      symbol,
    );
    console.log("Account:", account);
    console.log(
      "Balance:",
      formatAmount(await token.balanceOf(account)),
      symbol,
    );

    return;
  }

  if (action === "name") {
    printContext();
    console.log("Name:", await token.name());
    return;
  }

  if (action === "symbol") {
    printContext();
    console.log("Symbol:", symbol);
    return;
  }

  if (action === "decimals") {
    printContext();
    console.log("Decimals:", decimals);
    return;
  }

  if (action === "totalSupply") {
    printContext();
    console.log(
      "Total supply:",
      formatAmount(await token.totalSupply()),
      symbol,
    );
    return;
  }

  if (action === "balanceOf") {
    const account = ethers.getAddress(
      process.env.ACCOUNT_ADDRESS?.trim() ?? callerAddress,
    );

    printContext();
    console.log("Account:", account);
    console.log(
      "Balance:",
      formatAmount(await token.balanceOf(account)),
      symbol,
    );

    return;
  }

  if (action === "balances") {
    printContext();

    for (const [index, currentSigner] of signers.entries()) {
      const account = await currentSigner.getAddress();
      const balance = await token.balanceOf(account);

      console.log(
        `Signer ${index}:`,
        account,
        "-",
        formatAmount(balance),
        symbol,
      );
    }

    return;
  }

  if (action === "transfer") {
    const recipient = ethers.getAddress(required("RECIPIENT_ADDRESS"));
    const amount = parseAmount(required("TOKEN_AMOUNT"));

    const senderBefore = await token.balanceOf(callerAddress);
    const recipientBefore = await token.balanceOf(recipient);

    const transaction = await token.transfer(recipient, amount);

    const receipt = await transaction.wait(transactionConfirmations);

    if (!receipt || receipt.status !== 1) {
      throw new Error(`Transfer transaction failed: ${transaction.hash}`);
    }

    const senderAfter = await token.balanceOf(callerAddress, {
      blockTag: receipt.blockNumber,
    });
    const recipientAfter = await token.balanceOf(recipient, {
      blockTag: receipt.blockNumber,
    });

    printContext();
    console.log("Transaction:", transaction.hash);
    console.log("Block:", receipt.blockNumber);
    console.log("Confirmations requested:", transactionConfirmations);
    console.log("Recipient:", recipient);
    console.log("Transferred:", formatAmount(amount), symbol);
    console.log(
      "Sender balance:",
      formatAmount(senderAfter),
      symbol,
      `(before: ${formatAmount(senderBefore)})`,
    );
    console.log(
      "Recipient balance:",
      formatAmount(recipientAfter),
      symbol,
      `(before: ${formatAmount(recipientBefore)})`,
    );

    return;
  }

  if (action === "approve") {
    const spender = ethers.getAddress(required("SPENDER_ADDRESS"));
    const amount = parseAmount(required("TOKEN_AMOUNT"));

    const allowanceBefore = await token.allowance(callerAddress, spender);
    const transaction = await token.approve(spender, amount);
    const receipt = await transaction.wait(transactionConfirmations);

    if (!receipt || receipt.status !== 1) {
      throw new Error(`Approve transaction failed: ${transaction.hash}`);
    }

    const allowanceAfter = await token.allowance(callerAddress, spender, {
      blockTag: receipt.blockNumber,
    });

    printContext();
    console.log("Transaction:", transaction.hash);
    console.log("Block:", receipt.blockNumber);
    console.log("Confirmations requested:", transactionConfirmations);
    console.log("Owner:", callerAddress);
    console.log("Spender:", spender);
    console.log("Approved amount:", formatAmount(amount), symbol);
    console.log(
      "Allowance:",
      formatAmount(allowanceAfter),
      symbol,
      `(before: ${formatAmount(allowanceBefore)})`,
    );

    return;
  }

  if (action === "allowance") {
    const owner = ethers.getAddress(required("OWNER_ADDRESS"));
    const spender = ethers.getAddress(required("SPENDER_ADDRESS"));

    printContext();
    console.log("Owner:", owner);
    console.log("Spender:", spender);
    console.log(
      "Allowance:",
      formatAmount(await token.allowance(owner, spender)),
      symbol,
    );

    return;
  }

  if (action === "transferFrom") {
    const from = ethers.getAddress(required("FROM_ADDRESS"));
    const recipient = ethers.getAddress(required("RECIPIENT_ADDRESS"));
    const amount = parseAmount(required("TOKEN_AMOUNT"));

    if (from === callerAddress) {
      console.warn(
        "Warning: FROM_ADDRESS and caller/spender are the same account. " +
          "This is valid, but it does not demonstrate delegated spending " +
          "between two different accounts.",
      );
    }

    const allowanceBefore = await token.allowance(from, callerAddress);
    const fromBefore = await token.balanceOf(from);
    const recipientBefore = await token.balanceOf(recipient);

    if (allowanceBefore < amount) {
      throw new Error(
        `Insufficient allowance. Caller ${callerAddress} may spend ` +
          `${formatAmount(allowanceBefore)} ${symbol} from ${from}, but ` +
          `${formatAmount(amount)} ${symbol} was requested.`,
      );
    }

    if (fromBefore < amount) {
      throw new Error(
        `Insufficient owner balance. Account ${from} has ` +
          `${formatAmount(fromBefore)} ${symbol}, but ` +
          `${formatAmount(amount)} ${symbol} was requested.`,
      );
    }

    const transaction = await token.transferFrom(from, recipient, amount);
    const receipt = await transaction.wait(transactionConfirmations);

    if (!receipt || receipt.status !== 1) {
      throw new Error(`transferFrom transaction failed: ${transaction.hash}`);
    }

    const allowanceAfter = await token.allowance(from, callerAddress, {
      blockTag: receipt.blockNumber,
    });
    const fromAfter = await token.balanceOf(from, {
      blockTag: receipt.blockNumber,
    });
    const recipientAfter = await token.balanceOf(recipient, {
      blockTag: receipt.blockNumber,
    });

    printContext();
    console.log("Transaction:", transaction.hash);
    console.log("Block:", receipt.blockNumber);
    console.log("Confirmations requested:", transactionConfirmations);
    console.log("Caller/spender:", callerAddress);
    console.log("From:", from);
    console.log("Recipient:", recipient);
    console.log("Transferred:", formatAmount(amount), symbol);
    console.log(
      "Remaining allowance:",
      formatAmount(allowanceAfter),
      symbol,
      `(before: ${formatAmount(allowanceBefore)})`,
    );
    console.log(
      "Owner balance:",
      formatAmount(fromAfter),
      symbol,
      `(before: ${formatAmount(fromBefore)})`,
    );
    console.log(
      "Recipient balance:",
      formatAmount(recipientAfter),
      symbol,
      `(before: ${formatAmount(recipientBefore)})`,
    );

    return;
  }

  throw new Error(
    `Unknown ACTION "${action}". Use accounts, network, info, name, symbol, ` +
      `decimals, totalSupply, balanceOf, balances, transfer, approve, ` +
      `allowance, or transferFrom.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
