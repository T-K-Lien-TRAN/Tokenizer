// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Tokenizer42
/// @notice A fixed-supply ERC-20/BEP-20-compatible educational token.
/// @dev The complete supply is minted once to the deployment account.
///      The contract has no owner, administrator, pause, blacklist, fee,
///      upgrade, or post-deployment minting mechanism.
contract TokenizerToken is ERC20 {
    /// @notice Raised when deployment is attempted with an empty supply.
    error TokenizerTokenZeroInitialSupply();

    /// @param initialSupply Supply in the token's smallest unit (18 decimals).
    constructor(uint256 initialSupply) ERC20("Tokenizer42", "TK42") {
        if (initialSupply == 0) {
            revert TokenizerTokenZeroInitialSupply();
        }

        _mint(msg.sender, initialSupply);
    }
}
