import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DEFAULT_INITIAL_SUPPLY = 1_000_000n * 10n ** 18n;

export default buildModule("TokenizerTokenModule", (m) => {
  const initialSupply = m.getParameter(
    "initialSupply",
    DEFAULT_INITIAL_SUPPLY,
  );

  const token = m.contract("TokenizerToken", [initialSupply]);

  return { token };
});
