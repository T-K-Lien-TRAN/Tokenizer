import { expect } from "chai";
import type { Contract } from "ethers";
import { network } from "hardhat";

const { ethers } = await network.connect();
const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18);

describe("TokenizerToken", function () {
  async function deployToken(initialSupply = INITIAL_SUPPLY) {
    const [deployer, alice, bob] = await ethers.getSigners();
    const token = (await ethers.deployContract("TokenizerToken", [
      initialSupply,
    ])) as Contract;
    await token.waitForDeployment();

    return { token, deployer, alice, bob };
  }

  it("sets the required name, ticker, decimals, and fixed initial supply", async function () {
    const { token, deployer } = await deployToken();

    expect(await token.name()).to.equal("Tokenizer42");
    expect(await token.symbol()).to.equal("TK42");
    expect(await token.decimals()).to.equal(18n);
    expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY);
    expect(await token.balanceOf(deployer.address)).to.equal(INITIAL_SUPPLY);
  });

  it("mints the complete supply once to the deployment account", async function () {
    const { token, deployer, alice } = await deployToken();

    expect(await token.balanceOf(deployer.address)).to.equal(INITIAL_SUPPLY);
    expect(await token.balanceOf(alice.address)).to.equal(0n);

    // No public mint function exists. The total supply can only decrease if a
    // burn mechanism is explicitly added, which this contract does not do.
    expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY);
  });

  it("transfers tokens and emits the standard Transfer event", async function () {
    const { token, deployer, alice } = await deployToken();
    const amount = ethers.parseUnits("100", 18);

    await expect(token.transfer(alice.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(deployer.address, alice.address, amount);

    expect(await token.balanceOf(alice.address)).to.equal(amount);
    expect(await token.balanceOf(deployer.address)).to.equal(
      INITIAL_SUPPLY - amount,
    );
  });

  it("supports approve, allowance, and transferFrom", async function () {
    const { token, deployer, alice, bob } = await deployToken();
    const allowance = ethers.parseUnits("50", 18);
    const spent = ethers.parseUnits("20", 18);

    await expect(token.approve(alice.address, allowance))
      .to.emit(token, "Approval")
      .withArgs(deployer.address, alice.address, allowance);

    expect(await token.allowance(deployer.address, alice.address)).to.equal(
      allowance,
    );

    const tokenAsAlice = token.connect(alice) as Contract;
    await tokenAsAlice.transferFrom(deployer.address, bob.address, spent);

    expect(await token.balanceOf(bob.address)).to.equal(spent);
    expect(await token.allowance(deployer.address, alice.address)).to.equal(
      allowance - spent,
    );
  });

  it("rejects deployment with an empty supply", async function () {
    const { token } = await deployToken();

    await expect(ethers.deployContract("TokenizerToken", [0n]))
      .to.be.revertedWithCustomError(token, "TokenizerTokenZeroInitialSupply");
  });

  it("rejects a transfer larger than the sender balance", async function () {
    const { token, alice, bob } = await deployToken();

    const tokenAsAlice = token.connect(alice) as Contract;
    await expect(tokenAsAlice.transfer(bob.address, 1n))
      .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
      .withArgs(alice.address, 0n, 1n);
  });

  it("rejects a transfer to the zero address", async function () {
    const { token } = await deployToken();

    await expect(token.transfer(ethers.ZeroAddress, 1n))
      .to.be.revertedWithCustomError(token, "ERC20InvalidReceiver")
      .withArgs(ethers.ZeroAddress);
  });

  it("rejects transferFrom when the allowance is insufficient", async function () {
    const { token, deployer, alice, bob } = await deployToken();

    await expect(
      (token.connect(alice) as Contract).transferFrom(
        deployer.address,
        bob.address,
        1n,
      ),
    )
      .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance")
      .withArgs(alice.address, 0n, 1n);
  });
});
