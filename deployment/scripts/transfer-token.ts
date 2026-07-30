import { network } from "hardhat";

const tokenAddress = process.env.TOKEN_ADDRESS;
const recipientAddress = process.env.RECIPIENT_ADDRESS;
const tokenAmount = process.env.TOKEN_AMOUNT ?? "1";

if (tokenAddress === undefined || tokenAddress.trim() === "") {
  throw new Error("Set TOKEN_ADDRESS to the deployed Tokenizer42 contract address.");
}
if (recipientAddress === undefined || recipientAddress.trim() === "") {
  throw new Error("Set RECIPIENT_ADDRESS to the public recipient address.");
}

const { ethers } = await network.create();
if (!ethers.isAddress(tokenAddress)) {
  throw new Error(`Invalid TOKEN_ADDRESS: ${tokenAddress}`);
}
if (!ethers.isAddress(recipientAddress)) {
  throw new Error(`Invalid RECIPIENT_ADDRESS: ${recipientAddress}`);
}
if (recipientAddress === ethers.ZeroAddress) {
  throw new Error("RECIPIENT_ADDRESS must not be the zero address.");
}

let amount: bigint;
try {
  amount = ethers.parseUnits(tokenAmount, 18);
} catch {
  throw new Error(`Invalid TOKEN_AMOUNT: ${tokenAmount}`);
}
if (amount <= 0n) {
  throw new Error("TOKEN_AMOUNT must be greater than zero.");
}

const token = await ethers.getContractAt("TokenizerToken", tokenAddress);
const [sender] = await ethers.getSigners();
const senderBalance = await token.balanceOf(sender.address);

if (senderBalance < amount) {
  throw new Error(
    `Insufficient TK42 balance: have ${ethers.formatUnits(senderBalance, 18)}, ` +
      `need ${tokenAmount}.`,
  );
}

console.log(`Sending ${tokenAmount} TK42 from ${sender.address}`);
console.log(`Recipient: ${recipientAddress}`);

const transaction = await token.transfer(recipientAddress, amount);
console.log("Transaction submitted:", transaction.hash);

const receipt = await transaction.wait();
if (receipt === null) {
  throw new Error("The transfer transaction was not mined.");
}

console.log("Transfer confirmed in block:", receipt.blockNumber);
console.log(
  "Recipient balance:",
  ethers.formatUnits(await token.balanceOf(recipientAddress), 18),
  "TK42",
);
