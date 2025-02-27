// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Deck.sol";
import "./PokerHandEvaluator.sol";

contract TexasHoldem {
    using PokerHandEvaluator for uint8[7];

    struct Player {
        address addr;
        uint256 balance;
        uint256 betAmount;
        uint8[2] holeCards;
        bool isActive;
        bool hasFolded;
    }

    Deck private deckContract;
    uint8[5] public communityCards;
    mapping(address => Player) public players;
    address[] public playerAddresses;
    uint256 public pot;
    uint256 public currentBet; // Current bet amount in the round
    bool public gameStarted;

    event PotSizeDebug(uint256 potAmount, address winner); // ✅ Debug event
    event JoinedGame(address indexed player, uint256 betAmount);
    event GameStarted();
    event CardsDealt();
    event BetPlaced(address indexed player, uint256 amount);
    event PlayerFolded(address indexed player);
    event WinnerDeclared(address indexed winner, uint256 winnings);

    modifier onlyActivePlayer() {
        require(players[msg.sender].isActive, "Not an active player");
        require(!players[msg.sender].hasFolded, "Player has folded");
        _;
    }

    constructor(address _deckContract) {
        deckContract = Deck(_deckContract);
    }

    // ✅ Players must buy in with EXACTLY 2 ETH
    function joinGame() external payable {
        require(!gameStarted, "Game already started");
        require(msg.value == 2 ether, "Buy-in must be exactly 2 ETH");
        require(players[msg.sender].addr == address(0), "Already joined");

        players[msg.sender] = Player(msg.sender, msg.value, 0, [0, 0], true, false);
        playerAddresses.push(msg.sender);
        pot += msg.value;

        emit JoinedGame(msg.sender, msg.value);
    }

    function startGame() external {
        require(playerAddresses.length >= 2, "Not enough players");
        gameStarted = true;
        deckContract.shuffleDeck();
        emit GameStarted();
    }

    function dealCards() external {
        require(gameStarted, "Game has not started");

        for (uint8 i = 0; i < playerAddresses.length; i++) {
            players[playerAddresses[i]].holeCards = [deckContract.drawCard(), deckContract.drawCard()];
        }

        for (uint8 i = 0; i < 5; i++) {
            communityCards[i] = deckContract.drawCard();
        }

        emit CardsDealt();
    }

    // ✅ Players can place a bet
    function placeBet() external payable onlyActivePlayer {
        require(gameStarted, "Game has not started");
        require(currentBet == 0, "A bet has already been placed. Use call, raise, or fold."); // ✅ Prevent multiple initial bets
        require(msg.value > 0, "Bet must be greater than 0");

        players[msg.sender].betAmount = msg.value;
        currentBet = msg.value; // ✅ Set the current bet to the first bet amount
        pot += msg.value;
        
        emit BetPlaced(msg.sender, msg.value);
    }

    // ✅ Players can call (match the current bet)
    function callBet() external payable onlyActivePlayer {
        require(gameStarted, "Game has not started");

        uint256 highestBet = getHighestBet();
        currentBet = players[msg.sender].betAmount;
        uint256 callAmount = highestBet - currentBet; // Only pay the difference

        require(msg.value == callAmount, "Incorrect call amount");

        players[msg.sender].betAmount += msg.value;
        pot += msg.value;

        emit BetPlaced(msg.sender, msg.value);
    }

    // ✅ Players can raise the bet
   function raiseBet(uint256 raiseAmount) external payable onlyActivePlayer {
        require(gameStarted, "Game has not started");
        require(raiseAmount > 0, "Raise must be greater than 0");

        uint256 highestBet = getHighestBet();
        uint256 playerCurrentBet = players[msg.sender].betAmount;

        // ✅ If player hasn't called, first match the highest bet
        uint256 amountToCall = (highestBet > playerCurrentBet) ? (highestBet - playerCurrentBet) : 0;

        // ✅ New total amount includes only the raise beyond the current highest bet
        uint256 newBetAmount = highestBet + raiseAmount;

        require(msg.value == (amountToCall + raiseAmount), "Incorrect raise amount");

        // ✅ Update player's bet and total pot
        players[msg.sender].betAmount = newBetAmount;
        pot += msg.value;
        currentBet = newBetAmount; // ✅ Update current bet

        emit BetPlaced(msg.sender, msg.value);
    }


    // ✅ Players can fold
    function fold() external onlyActivePlayer {
        players[msg.sender].hasFolded = true;

        // ✅ Remove their bet from the pot (they forfeit their bet)
        pot -= players[msg.sender].betAmount;
        
        emit PlayerFolded(msg.sender);
    }

    function declareWinner() external {
        require(gameStarted, "Game has not started");
        require(playerAddresses.length > 0, "No players in the game");

        address winner;
        uint256 activePlayers = 0;

        // ✅ Find the last remaining active player
        for (uint8 i = 0; i < playerAddresses.length; i++) {
            if (!players[playerAddresses[i]].hasFolded) {
                winner = playerAddresses[i];
                activePlayers++;
            }
        }

        // ✅ If only one player remains, they win immediately
        if (activePlayers == 1) {
            payable(winner).transfer(pot);
            emit WinnerDeclared(winner, pot);
            resetGame();
            return;
        }

        // ✅ Otherwise, evaluate hands for showdown
        PokerHandEvaluator.Hand memory bestHandRank = PokerHandEvaluator.Hand(PokerHandEvaluator.HandRank.HighCard, 0);

        for (uint8 i = 0; i < playerAddresses.length; i++) {
            Player memory player = players[playerAddresses[i]];

            if (player.hasFolded) {
                continue; // Skip folded players
            }

            uint8[7] memory fullHand;
            fullHand[0] = player.holeCards[0];
            fullHand[1] = player.holeCards[1];
            for (uint8 j = 0; j < 5; j++) {
                fullHand[2 + j] = communityCards[j];
            }

            uint8[5] memory bestFiveCardHand;
            (bestFiveCardHand, bestHandRank.rank) = PokerHandEvaluator.findBestFiveCardHand(fullHand);
            PokerHandEvaluator.Hand memory currentHandRank = PokerHandEvaluator.evaluateHand(bestFiveCardHand);

            if (currentHandRank.rank > bestHandRank.rank) {
                bestHandRank = currentHandRank;
                winner = player.addr;
            } else if (currentHandRank.rank == bestHandRank.rank) {
                if (currentHandRank.highestCard > bestHandRank.highestCard) {
                    bestHandRank = currentHandRank;
                    winner = player.addr;
                }
            }
        }

        // ✅ Ensure only the pot with active players’ bets is transferred
        payable(winner).transfer(pot);
        emit WinnerDeclared(winner, pot);

        resetGame();
    }


    function getHoleCards() external view onlyActivePlayer returns (uint8[2] memory) {
        return players[msg.sender].holeCards;
    }

    function getCommunityCards() external view returns (uint8[5] memory) {
        return communityCards;
    }

    function getHighestBet() public view returns (uint256) {
    uint256 highest = 0;
    for (uint8 i = 0; i < playerAddresses.length; i++) {
        if (players[playerAddresses[i]].betAmount > highest) {
            highest = players[playerAddresses[i]].betAmount;
        }
    }
    return highest;
    }

    function getPlayerBet(address player) external view returns (uint256) {
        return players[player].betAmount;
    }

    function resetGame() internal {
        for (uint8 i = 0; i < playerAddresses.length; i++) {
            players[playerAddresses[i]].isActive = false;
        }
        delete playerAddresses;
        gameStarted = false;
        pot = 0;
        currentBet = 0;
    }
}






