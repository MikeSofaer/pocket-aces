// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library PokerHandEvaluator {
    enum HandRank { HighCard, OnePair, TwoPair, ThreeOfAKind, Straight, Flush, FullHouse, FourOfAKind, StraightFlush, RoyalFlush }

    struct Hand {
        HandRank rank;
        uint8 highestCard;
    }

    function evaluateHand(uint8[5] memory cards) public pure returns (Hand memory) {
        uint8[5] memory ranks;
        uint8[5] memory suits;

        // Extract rank and suit
        for (uint8 i = 0; i < 5; i++) {
            ranks[i] = (cards[i] - 1) % 13 + 1; // Convert 1-52 to rank (1-13)
            suits[i] = (cards[i] - 1) / 13;     // Convert 1-52 to suit (0-3)

            // Convert Ace (1) to 14 for sorting purposes
            if (ranks[i] == 1) {
                ranks[i] = 14;
            }
        }

        // Sort ranks in descending order and counts
        ranks = sortRanks(ranks);
        uint8[13] memory rankCounts = countRanks(ranks);
        uint8 firstPair = 0;
        uint8 secondPair = 0;
        uint8 threeOfAKindRank = 0;

        // Check Flush and Straight
        bool isFlushHand = isFlush(suits);
        bool isStraightHand = findStraight(ranks);
        bool isRoyalStraightHand = isRoyalStraight(ranks);

        // ✅ Royal Flush Check (Ensures Ace-High straight is checked first)
        if (isFlushHand && isRoyalStraightHand) {
            return Hand(HandRank.RoyalFlush, ranks[0]);
        }

        // ✅ Straight Flush Check
        if (isFlushHand && isStraightHand) {
            return Hand(HandRank.StraightFlush, ranks[0]);
        }

        // ✅ Four of a Kind Logic
        for (uint8 i = 0; i < 13; i++) {
            if (rankCounts[i] == 4) {
                return Hand(HandRank.FourOfAKind, i + 1); // Rank of the Four of a Kind
            }
        }

        // ✅ Find pairs and three-of-a-kind
        for (uint8 i = 0; i < 13; i++) {
            if (rankCounts[i] == 3) {
                threeOfAKindRank = i + 1; // ✅ Store Three of a Kind
            } else if (rankCounts[i] == 2) {
                if (firstPair == 0) {
                    firstPair = i + 1; // ✅ First pair found
                } else {
                    secondPair = i + 1; // ✅ Second pair found
                }
            }
        }

        // ✅ Full House Check (Three of a Kind + One Pair)
        if (threeOfAKindRank > 0 && firstPair > 0 && secondPair == 0) {
            return Hand(HandRank.FullHouse, threeOfAKindRank);
        }

        // ✅ Straight Check
        if (isStraightHand) {
            return Hand(HandRank.Straight, ranks[0]);
        }

        // ✅ Flush Check
        if (isFlushHand) {
            return Hand(HandRank.Flush, ranks[0]);
        }

        // ✅ Three of a Kind Check (Ensures exactly one rank appears three times)
        if (threeOfAKindRank > 0) {
            return Hand(HandRank.ThreeOfAKind, threeOfAKindRank); // ✅ Return Three of a Kind
        }

        if (firstPair > 0 && secondPair > 0) {
            require(firstPair != secondPair, "Error: Duplicate pairs detected!"); // Ensure distinct pairs
            return Hand(HandRank.TwoPair, firstPair > secondPair ? firstPair : secondPair);
        }

        if (firstPair > 0) {
            return Hand(HandRank.OnePair, firstPair);
        }

        // ✅ Two Pair Check (Ensures Full House isn't misclassified)
        if (firstPair > 0 && secondPair > 0) {
            return Hand(HandRank.TwoPair, firstPair > secondPair ? firstPair : secondPair); // ✅ Highest pair determines rank
        }
        // ✅ One Pair Check (ensures it's not misclassified)
        if (firstPair > 0) {
            return Hand(HandRank.OnePair, firstPair);
        }

        return Hand(HandRank.HighCard, ranks[0]); // Default to High Card
    }

    function sortRanks(uint8[5] memory ranks) public pure returns (uint8[5] memory) {
        for (uint8 i = 0; i < 4; i++) {
            for (uint8 j = i + 1; j < 5; j++) {
                if (ranks[i] < ranks[j]) {
                    (ranks[i], ranks[j]) = (ranks[j], ranks[i]); // Swap values
                }
            }
        }
        return ranks;
    }

    function isFlush(uint8[5] memory suits) public pure returns (bool) {
        for (uint8 i = 1; i < 5; i++) {
            if (suits[i] != suits[0]) {
                return false;
            }
        }
        return true;
    }

    function isRoyalStraight(uint8[5] memory ranks) public pure returns (bool) {
        return (ranks[0] == 14 && ranks[1] == 13 && ranks[2] == 12 && ranks[3] == 11 && ranks[4] == 10);
    }

    function findStraight(uint8[5] memory ranks) public pure returns (bool) {
        // ✅ Check for Ace-low straight (A-2-3-4-5)
        if (ranks[0] == 14 && ranks[1] == 5 && ranks[2] == 4 && ranks[3] == 3 && ranks[4] == 2) {
            return true; // ✅ Ace-low straight detected
        }

        // ✅ Standard Straight Check (Descending Order)
        for (uint8 i = 0; i < 4; i++) {
            if (ranks[i] != ranks[i + 1] + 1) {
                return false; // ❌ Not a continuous sequence
            }
        }

        return true; // ✅ All cards are consecutive
    }
    function countRanks(uint8[5] memory ranks) public pure returns (uint8[13] memory) {
        uint8[13] memory counts;
        for (uint8 i = 0; i < 5; i++) {
            uint8 rankIndex = (ranks[i] == 14) ? 0 : ranks[i] - 1; // ✅ Map Ace (14) to index 0
            require(rankIndex < 13, "countRanks: Rank index out of bounds"); // ✅ Safety check
            counts[rankIndex]++;
        }
        return counts;
    }

    function findBestFiveCardHand(uint8[7] memory fullHand)
    public pure returns (uint8[5] memory bestHand, HandRank rank) {
    Hand memory bestEvaluatedHand = Hand(HandRank.HighCard, 0);

    // Iterate over all 21 combinations of 5-card hands from 7 cards
    for (uint8 i = 0; i < 7; i++) {
        for (uint8 j = i + 1; j < 7; j++) {
            uint8[5] memory currentHand;
            uint8 index = 0;

            // Create a 5-card hand by excluding cards i and j
            for (uint8 k = 0; k < 7; k++) {
                if (k != i && k != j) {
                    currentHand[index] = fullHand[k];
                    index++;
                }
            }

            // Evaluate the hand
            Hand memory evaluatedHand = evaluateHand(currentHand);

            // Compare with the best hand found so far
            if (evaluatedHand.rank > bestEvaluatedHand.rank) {
                bestEvaluatedHand = evaluatedHand;
                bestHand = currentHand;
            } else if (evaluatedHand.rank == bestEvaluatedHand.rank) {
                // If ranks are the same, compare highest card
                if (evaluatedHand.highestCard > bestEvaluatedHand.highestCard) {
                    bestEvaluatedHand = evaluatedHand;
                    bestHand = currentHand;
                }
            }
        }
    }
}
}