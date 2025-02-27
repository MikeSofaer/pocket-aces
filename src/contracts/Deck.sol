// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Deck {
    uint8[52] private deck;
    uint8 private deckIndex;
    uint8 public lastDrawnCard;

    constructor() {
        initializeDeck();
    }

    function initializeDeck() internal {
        for (uint8 i = 0; i < 52; i++) {
            deck[i] = i + 1; // Cards are indexed from 1-52
        }
    }

    function shuffleDeck() external {
        for (uint8 i = 0; i < 52; i++) {
            uint8 n = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, i))) % 52);
            (deck[i], deck[n]) = (deck[n], deck[i]); // Swap cards
        }
        deckIndex = 0;
    }



    function drawCard() external returns (uint8) {
    require(deckIndex < 52, "Deck is empty");
    lastDrawnCard = deck[deckIndex++];
    return lastDrawnCard;
}

    function getCardString(uint8 cardIndex) external pure returns (string memory) {
        require(cardIndex >= 1 && cardIndex <= 52, "Invalid card index");

        string[13] memory ranks = [
            "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"
        ];
        string[4] memory suits = ["Clubs", "Diamonds", "Hearts", "Spades"];

        uint8 rankIndex = (cardIndex - 1) % 13;
        uint8 suitIndex = (cardIndex - 1) / 13;

        return string(abi.encodePacked(ranks[rankIndex], " of ", suits[suitIndex]));
    }
}