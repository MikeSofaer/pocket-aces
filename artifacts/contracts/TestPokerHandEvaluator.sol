// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PokerHandEvaluator.sol";

contract TestPokerHandEvaluator {
    using PokerHandEvaluator for uint8[5];

    function evaluateHand(uint8[5] memory cards) public pure returns (PokerHandEvaluator.Hand memory) {
        return PokerHandEvaluator.evaluateHand(cards); // ✅ Uses the linked library
    }
}