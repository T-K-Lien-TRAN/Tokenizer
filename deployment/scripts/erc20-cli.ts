import { network } from "hardhat";

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required variable: ${name}`);
  }

  return value;
}

async function main(): Promise<void> {
  const { ethers } = await network.create();
  const signers = await ethers.getSigners();

  const signerIndex = Number(process.env.SIGNER_INDEX ?? "0");
  const signer = signers[signerIndex];

  if (signer === undefined) {
    throw new Error(`No signer exists at index ${signerIndex}`);
  }

  const callerAddress = await signer.getAddress();
  const tokenAddress = ethers.getAddress(required("TOKEN_ADDRESS"));
  const action = required("ACTION");

  const token = await ethers.getContractAt(
    "TokenizerToken",
    tokenAddress,
    signer,
  );

  const decimals = Number(await token.decimals());
  const symbol = await token.symbol();

  const parseAmount = (amount: string): bigint =>
    ethers.parseUnits(amount, decimals);

  const formatAmount = (amount: bigint): string =>
    ethers.formatUnits(amount, decimals);

  if (action === "info") {
    const account = ethers.getAddress(
      process.env.ACCOUNT_ADDRESS ?? callerAddress,
    );

    console.log("Contract:", tokenAddress);
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

  if (action === "transfer") {
    const recipient = ethers.getAddress(required("RECIPIENT_ADDRESS"));
    const amount = parseAmount(required("TOKEN_AMOUNT"));

    const senderBefore = await token.balanceOf(callerAddress);
    const recipientBefore = await token.balanceOf(recipient);

    const transaction = await token.transfer(recipient, amount);
    const receipt = await transaction.wait();

    console.log("Transaction:", transaction.hash);
    console.log("Block:", receipt?.blockNumber);
    console.log(
      "Sender balance:",
      formatAmount(await token.balanceOf(callerAddress)),
      symbol,
      `(before: ${formatAmount(senderBefore)})`,
    );
    console.log(
      "Recipient balance:",
      formatAmount(await token.balanceOf(recipient)),
      symbol,
      `(before: ${formatAmount(recipientBefore)})`,
    );

    return;
  }

  if (action === "approve") {
    const spender = ethers.getAddress(required("SPENDER_ADDRESS"));
    const amount = parseAmount(required("TOKEN_AMOUNT"));

    const transaction = await token.approve(spender, amount);
    const receipt = await transaction.wait();

    console.log("Transaction:", transaction.hash);
    console.log("Block:", receipt?.blockNumber);
    console.log("Owner:", callerAddress);
    console.log("Spender:", spender);
    console.log(
      "Allowance:",
      formatAmount(await token.allowance(callerAddress, spender)),
      symbol,
    );

    return;
  }

  if (action === "allowance") {
    const owner = ethers.getAddress(required("OWNER_ADDRESS"));
    const spender = ethers.getAddress(required("SPENDER_ADDRESS"));

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

    const allowanceBefore = await token.allowance(from, callerAddress);
    const fromBefore = await token.balanceOf(from);
    const recipientBefore = await token.balanceOf(recipient);

    const transaction = await token.transferFrom(
      from,
      recipient,
      amount,
    );
    const receipt = await transaction.wait();
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Transaction:", transaction.hash);
    console.log("Block:", receipt?.blockNumber);
    console.log("Caller/spender:", callerAddress);
    console.log(
      "Remaining allowance:",
      formatAmount(await token.allowance(from, callerAddress)),
      symbol,
      `(before: ${formatAmount(allowanceBefore)})`,
    );
    console.log(
      "Owner balance:",
      formatAmount(await token.balanceOf(from)),
      symbol,
      `(before: ${formatAmount(fromBefore)})`,
    );
    console.log(
      "Recipient balance:",
      formatAmount(await token.balanceOf(recipient)),
      symbol,
      `(before: ${formatAmount(recipientBefore)})`,
    );

    return;
  }

  throw new Error(
    `Unknown ACTION "${action}". Use info, transfer, approve, allowance, or transferFrom.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
