import { network } from "hardhat";

const address = process.env.TOKEN_ADDRESS;
if (address === undefined || address.trim() === "") {
  throw new Error("Set TOKEN_ADDRESS to the deployed Tokenizer42 contract address.");
}

const { ethers } = await network.create();
if (!ethers.isAddress(address)) {
  throw new Error(`Invalid TOKEN_ADDRESS: ${address}`);
}

const token = await ethers.getContractAt("TokenizerToken", address);
const [signer] = await ethers.getSigners();
const decimals = await token.decimals();
console.log("Network:", (await ethers.provider.getNetwork()).name);
console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
console.log("Contract:", await token.getAddress());
console.log("Token name:", await token.name());
console.log("Ticker:", await token.symbol());
//console.log("Decimals:", await token.decimals());
console.log("Decimals:", decimals.toString());
console.log("Total supply:", ethers.formatUnits(await token.totalSupply(), 18));
console.log(
  "Connected account balance:",
  ethers.formatUnits(await token.balanceOf(signer.address), 18),
);



