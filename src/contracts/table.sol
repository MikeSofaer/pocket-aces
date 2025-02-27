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

    struct Spectator {
        address addr;
        address betOnAI;
        uint256 betAmount;
    }

    Deck private deckContract;
    uint8[5] public communityCards;
    mapping(address => Player) public players;
    mapping(address => Spectator) public spectators;
    address[] public spectatorAddresses; // New array to track spectators separately
    mapping(address => address) public spectatorBets; // Maps spectator to the AI they bet on
    address[] public playerAddresses;
    uint256 public aiPot;
    uint256 public spectatorPot;
    uint256 public currentBet; // Current bet amount in the round
    bool public gameStarted;

    // Hardcoded AI wallet addresses
    address public constant AI_PLAYER_1 = 0xf0B88B96491f3fCE34C353A5DD9e68E6eFc6b6A8;
    address public constant AI_PLAYER_2 = 0x098F822d12d7F0D19c6c01Ff2774FF9b3fDE1e46;

    event DebugWinner(address winningAI, uint256 aiPot, uint256 spectatorPot);
    event DebugSpectator(address spectator, address betOnAI, bool isWinner, uint256 payout);
    event PotSizeDebug(uint256 aiPot, uint256 spectatorPot, address winner);
    event JoinedGame(address indexed player, uint256 betAmount);
    event SpectatorJoined(address indexed spectator, address indexed betOnAI, uint256 betAmount);
    event GameStarted();
    event CardsDealt();
    event BetPlaced(address indexed player, uint256 amount);
    event PlayerFolded(address indexed player);
    event WinnerDeclared(address indexed winner, uint256 winnings);
    event SpectatorWinningsPaid(address indexed spectator, uint256 amount);

    modifier onlyActivePlayer() {
        require(players[msg.sender].isActive, "Not an active player");
        require(!players[msg.sender].hasFolded, "Player has folded");
        _;
    }

    modifier onlyAIPlayers() {
        require(msg.sender == AI_PLAYER_1 || msg.sender == AI_PLAYER_2, "Not an AI player");
        _;
    }

    constructor(address _deckContract) {
        deckContract = Deck(_deckContract);
    }

    function _registerAI(address aiAddress) internal {
        if (players[aiAddress].addr == address(0)) {
            players[aiAddress] = Player(aiAddress, 100, 0, [0, 0], true, false);
            playerAddresses.push(aiAddress);
            emit JoinedGame(aiAddress, 100);
        }
    }

    function joinAsSpectator(address betOnAI) external payable {
        require(!gameStarted, "Game already started");
        require(msg.value == 0.0002 ether, "Bet must be exactly 0.0002 ETH");
        require(spectators[msg.sender].addr == address(0), "Already joined as spectator");
        require(betOnAI == AI_PLAYER_1 || betOnAI == AI_PLAYER_2, "Must bet on a valid AI player");

        spectators[msg.sender] = Spectator(msg.sender, betOnAI, msg.value);
        spectatorBets[msg.sender] = betOnAI; // ✅ Store bet mapping
        spectatorAddresses.push(msg.sender); // ✅ Ensure spectator is tracked
        spectatorPot += msg.value;

        emit SpectatorJoined(msg.sender, betOnAI, msg.value);
    }

    function startGame() external {
        require(playerAddresses.length == 0, "Game already started with players");
        
        _registerAI(AI_PLAYER_1);
        _registerAI(AI_PLAYER_2);
        
        gameStarted = true;
        deckContract.shuffleDeck();
        dealCards();
        emit GameStarted();
    }

    function dealCards() internal {
        require(gameStarted, "Game has not started");

        for (uint8 i = 0; i < playerAddresses.length; i++) {
            players[playerAddresses[i]].holeCards = [deckContract.drawCard(), deckContract.drawCard()];
        }

        for (uint8 i = 0; i < 5; i++) {
            communityCards[i] = deckContract.drawCard();
        }

        emit CardsDealt();
    }

    function raiseBet(uint256 amount) external onlyAIPlayers {
        Player storage player = players[msg.sender];
        require(amount > currentBet, "Raise must be higher than current bet");
        require(player.balance >= amount, "Insufficient balance to raise"); // ✅ Debugging step

        player.balance -= amount;
        player.betAmount += amount;
        aiPot += amount;
        currentBet = amount;

        emit BetPlaced(msg.sender, amount);
    }

    event DebugWinningAI(address winningAI);
    event DebugSpectatorPot(uint256 potAmount);

    event DebugAIWinnerSelection(address indexed ai, uint256 handRank);
    event DebugSpectatorCheck(address spectator, address betOnAI, bool isMatch);
    event DebugFinalWinner(address winningAI, address winningSpectator, uint256 spectatorWinnings);

    function declareWinner() external {
        require(gameStarted, "Game has not started");

        address winningAI = AI_PLAYER_1;
        uint256 highestRank = 0;

        // Determine AI winner
        for (uint8 i = 0; i < playerAddresses.length; i++) {
            address aiAddr = playerAddresses[i];
            if (aiAddr != AI_PLAYER_1 && aiAddr != AI_PLAYER_2) continue;

            Player memory player = players[aiAddr];
            if (player.hasFolded) continue;

            uint8[7] memory fullHand = [
                player.holeCards[0], player.holeCards[1], 
                communityCards[0], communityCards[1], communityCards[2], communityCards[3], communityCards[4]
            ];
            uint8[5] memory bestFiveCardHand;
            (bestFiveCardHand, ) = PokerHandEvaluator.findBestFiveCardHand(fullHand);
            uint256 handRank = uint256(PokerHandEvaluator.evaluateHand(bestFiveCardHand).rank);

            emit DebugAIWinnerSelection(aiAddr, handRank);

            if (handRank > highestRank) {
                highestRank = handRank;
                winningAI = player.addr;
            }
        }

        emit DebugFinalWinner(winningAI, address(0), 0);

        // Distribute AI pot as fake balance
        players[winningAI].balance += aiPot;
        aiPot = 0;
        emit WinnerDeclared(winningAI, players[winningAI].balance);

        // Determine winning spectator
        address winningSpectator;
        uint256 spectatorWinnings = 0;

        for (uint8 i = 0; i < spectatorAddresses.length; i++) {
            address spectatorAddr = spectatorAddresses[i];
            bool isMatch = (spectatorBets[spectatorAddr] == winningAI);

            emit DebugSpectatorCheck(spectatorAddr, spectatorBets[spectatorAddr], isMatch);

            if (isMatch) {
                winningSpectator = spectatorAddr;
                spectatorWinnings = spectatorPot;
                break;
            }
        }

        emit DebugFinalWinner(winningAI, winningSpectator, spectatorWinnings);


        if (spectatorWinnings > 0) {
            (bool success, ) = payable(winningSpectator).call{value: spectatorWinnings}("");
            require(success, "Failed to transfer winnings to spectator");
            emit SpectatorWinningsPaid(winningSpectator, spectatorWinnings);
        }

        spectatorPot = 0;
        resetGame();
    }







    function getSpectatorCount() public view returns (uint256 count) {
        count = 0;
        for (uint8 i = 0; i < playerAddresses.length; i++) {
            address spectatorAddr = playerAddresses[i];
            if (spectators[spectatorAddr].addr != address(0)) {
                count++;
            }
        }
    }

    function getAIBalances() public view returns (uint256 ai1Balance, uint256 ai2Balance) {
        return (players[AI_PLAYER_1].balance, players[AI_PLAYER_2].balance);
    }



    function callBet() external onlyAIPlayers {
        Player storage player = players[msg.sender];
        require(player.balance >= currentBet, "Insufficient balance to call");
        player.balance -= currentBet;
        player.betAmount += currentBet;
        aiPot += currentBet;
        emit BetPlaced(msg.sender, currentBet);
    }

    function fold() external onlyAIPlayers {
        players[msg.sender].hasFolded = true;
        emit PlayerFolded(msg.sender);
    }

    function resetGame() internal {
        gameStarted = false;
        aiPot = 0;
        spectatorPot = 0;
        delete communityCards;
        
        for (uint8 i = 0; i < playerAddresses.length; i++) {
            players[playerAddresses[i]].betAmount = 0;
            players[playerAddresses[i]].hasFolded = false;
        }

        // Clear spectators
        for (uint8 i = 0; i < playerAddresses.length; i++) {
            delete spectators[playerAddresses[i]];
        }
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

    function getHoleCards() external view returns (uint8[2] memory) {
        require(players[msg.sender].addr != address(0), "AI player not found");
        return players[msg.sender].holeCards;
    }

    function getPlayerBet(address player) external view returns (uint256) {
        return players[player].betAmount;
    }

        function getWinningAIForTesting() public view returns (address) {
        address winningAI = AI_PLAYER_1;
        uint256 highestRank = 0;

        for (uint8 i = 0; i < playerAddresses.length; i++) {
            address aiAddr = playerAddresses[i];
            if (aiAddr != AI_PLAYER_1 && aiAddr != AI_PLAYER_2) continue;

            Player memory player = players[aiAddr];
            if (player.hasFolded) continue;

            uint8[7] memory fullHand = [
                player.holeCards[0], player.holeCards[1], 
                communityCards[0], communityCards[1], communityCards[2], communityCards[3], communityCards[4]
            ];
            uint8[5] memory bestFiveCardHand;
            (bestFiveCardHand, ) = PokerHandEvaluator.findBestFiveCardHand(fullHand);
            uint256 handRank = uint256(PokerHandEvaluator.evaluateHand(bestFiveCardHand).rank);

            if (handRank > highestRank) {
                highestRank = handRank;
                winningAI = player.addr;
            }
        }
        return winningAI;
    }

    function declareWinnerForTesting() external {
        require(gameStarted, "Game has not started");

        address winningAI = AI_PLAYER_1;

        emit DebugWinningAI(winningAI);
        emit DebugSpectatorPot(spectatorPot);

        players[winningAI].balance += aiPot;
        aiPot = 0;
        emit WinnerDeclared(winningAI, players[winningAI].balance);

        address winningSpectator;
        uint256 spectatorWinnings = 0;
        
        for (uint8 i = 0; i < spectatorAddresses.length; i++) {
            address spectatorAddr = spectatorAddresses[i];
            bool isMatch = (spectatorBets[spectatorAddr] == winningAI);
            
            emit DebugSpectatorCheck(spectatorAddr, spectatorBets[spectatorAddr], isMatch);

            if (isMatch) {
                winningSpectator = spectatorAddr;
                spectatorWinnings = spectatorPot;
                break;
            }
        }

        require(winningSpectator != address(0), "No winning spectator found");

        if (spectatorWinnings > 0) {
            (bool success, ) = payable(winningSpectator).call{value: spectatorWinnings}(""); 
            require(success, "Failed to transfer winnings to spectator");
            emit SpectatorWinningsPaid(winningSpectator, spectatorWinnings);
        }

        spectatorPot = 0;
        resetGame();
    }

    function forceAIWinner(address aiWinner) external {
        require(aiWinner == AI_PLAYER_1 || aiWinner == AI_PLAYER_2, "Invalid AI winner");
        players[aiWinner].balance += aiPot;
        aiPot = 0;
        emit WinnerDeclared(aiWinner, players[aiWinner].balance);
    }

    function forceSpectatorWinner(address spectator) external {
        require(spectators[spectator].addr != address(0), "Spectator not found");
        uint256 spectatorWinnings = spectatorPot;
        spectatorPot = 0;
        (bool success, ) = payable(spectator).call{value: spectatorWinnings}("");
        require(success, "Failed to transfer winnings to spectator");
        emit SpectatorWinningsPaid(spectator, spectatorWinnings);
    }
    function declareWinnerTest(address aiWinner, address spectator) external {
        require(aiWinner == AI_PLAYER_1 || aiWinner == AI_PLAYER_2, "Invalid AI winner");
        require(spectators[spectator].addr != address(0), "Spectator not found");

        // Distribute AI pot
        players[aiWinner].balance += aiPot;
        aiPot = 0;
        emit WinnerDeclared(aiWinner, players[aiWinner].balance);

        // Distribute spectator pot
        uint256 spectatorWinnings = spectatorPot;
        spectatorPot = 0;
        (bool success, ) = payable(spectator).call{value: spectatorWinnings}("");
        require(success, "Failed to transfer winnings to spectator");
        emit SpectatorWinningsPaid(spectator, spectatorWinnings);
    }
}




// pragma solidity ^0.8.19;

// import "./Deck.sol";
// import "./PokerHandEvaluator.sol";

// contract TexasHoldem {
//     using PokerHandEvaluator for uint8[7];

//     struct Player {
//         address addr;
//         uint256 balance;
//         uint256 betAmount;
//         uint8[2] holeCards;
//         bool isActive;
//         bool hasFolded;
//     }

//     struct Spectator {
//         address addr;
//         address betOnAI;
//         uint256 betAmount;
//     }

//     Deck private deckContract;
//     uint8[5] public communityCards;
//     mapping(address => Player) public players;
//     mapping(address => Spectator) public spectators;
//     address[] public playerAddresses;
//     uint256 public pot;
//     uint256 public currentBet; // Current bet amount in the round
//     bool public gameStarted;

//     // Hardcoded AI wallet addresses
//     address public constant AI_PLAYER_1 = 0xf0B88B96491f3fCE34C353A5DD9e68E6eFc6b6A8;
//     address public constant AI_PLAYER_2 = 0x098F822d12d7F0D19c6c01Ff2774FF9b3fDE1e46;

//     event PotSizeDebug(uint256 potAmount, address winner);
//     event JoinedGame(address indexed player, uint256 betAmount);
//     event SpectatorJoined(address indexed spectator, address indexed betOnAI, uint256 betAmount);
//     event GameStarted();
//     event CardsDealt();
//     event BetPlaced(address indexed player, uint256 amount);
//     event PlayerFolded(address indexed player);
//     event WinnerDeclared(address indexed winner, uint256 winnings);
//     event SpectatorWinningsPaid(address indexed spectator, uint256 amount);

//     modifier onlyActivePlayer() {
//         require(players[msg.sender].isActive, "Not an active player");
//         require(!players[msg.sender].hasFolded, "Player has folded");
//         _;
//     }

//     modifier onlyAIPlayers() {
//         require(msg.sender == AI_PLAYER_1 || msg.sender == AI_PLAYER_2, "Not an AI player");
//         _;
//     }

//     constructor(address _deckContract) {
//         deckContract = Deck(_deckContract);
//     }

//     function _registerAI(address aiAddress) internal {
//         if (players[aiAddress].addr == address(0)) {
//             players[aiAddress] = Player(aiAddress, 100, 0, [0, 0], true, false);
//             playerAddresses.push(aiAddress);
//             emit JoinedGame(aiAddress, 100);
//         }
//     }

//     function joinAsSpectator(address betOnAI) external payable {
//         require(!gameStarted, "Game already started");
//         require(msg.value == 0.0002 ether, "Bet must be exactly 0.0002 ETH");
//         require(spectators[msg.sender].addr == address(0), "Already joined as spectator");
//         require(betOnAI == AI_PLAYER_1 || betOnAI == AI_PLAYER_2, "Must bet on a valid AI player");

//         spectators[msg.sender] = Spectator(msg.sender, betOnAI, msg.value);
//         pot += msg.value;

//         emit SpectatorJoined(msg.sender, betOnAI, msg.value);
//     }

//     function startGame() external {
//         require(playerAddresses.length == 0, "Game already started with players");
        
//         _registerAI(AI_PLAYER_1);
//         _registerAI(AI_PLAYER_2);
        
//         gameStarted = true;
//         deckContract.shuffleDeck();
//         dealCards();
//         emit GameStarted();
//     }

//     function dealCards() internal {
//         require(gameStarted, "Game has not started");

//         for (uint8 i = 0; i < playerAddresses.length; i++) {
//             players[playerAddresses[i]].holeCards = [deckContract.drawCard(), deckContract.drawCard()];
//         }

//         for (uint8 i = 0; i < 5; i++) {
//             communityCards[i] = deckContract.drawCard();
//         }

//         emit CardsDealt();
//     }

//     function raiseBet(uint256 amount) external onlyAIPlayers {
//         require(amount > currentBet, "Raise must be higher than current bet");
//         Player storage player = players[msg.sender];
//         require(player.balance >= amount, "Insufficient balance to raise");
//         player.balance -= amount;
//         player.betAmount += amount;
//         pot += amount;
//         currentBet = amount;
//         emit BetPlaced(msg.sender, amount);
//     }

//     function callBet() external onlyAIPlayers {
//         Player storage player = players[msg.sender];
//         require(player.balance >= currentBet, "Insufficient balance to call");
//         player.balance -= currentBet;
//         player.betAmount += currentBet;
//         pot += currentBet;
//         emit BetPlaced(msg.sender, currentBet);
//     }

//     function fold() external onlyAIPlayers {
//         players[msg.sender].hasFolded = true;
//         emit PlayerFolded(msg.sender);
//     }
//     function declareWinner() external {
//         require(gameStarted, "Game has not started");
//         require(playerAddresses.length > 0, "No players in the game");

//         address winner = AI_PLAYER_1;
//         uint256 highestRank = 0;

//         for (uint8 i = 0; i < playerAddresses.length; i++) {
//             Player memory player = players[playerAddresses[i]];
//             if (player.hasFolded) continue;
            
//             uint8[7] memory fullHand = [player.holeCards[0], player.holeCards[1], communityCards[0], communityCards[1], communityCards[2], communityCards[3], communityCards[4]];
//             uint8[5] memory bestFiveCardHand;
//             (bestFiveCardHand, ) = PokerHandEvaluator.findBestFiveCardHand(fullHand);
//             uint256 handRank = uint256(PokerHandEvaluator.evaluateHand(bestFiveCardHand).rank);

            
//             if (handRank > highestRank) {
//                 highestRank = handRank;
//                 winner = player.addr;
//             }
//         }
        
//         payable(winner).transfer(pot);
//         emit WinnerDeclared(winner, pot);

//         // Payout spectators who bet on the winning AI
//         for (uint8 i = 0; i < playerAddresses.length; i++) {
//             address spectatorAddr = playerAddresses[i];
//             Spectator memory spectator = spectators[spectatorAddr];
//             if (spectator.betOnAI == winner) {
//                 uint256 payout = spectator.betAmount * 2;
//                 payable(spectatorAddr).transfer(payout);
//                 emit SpectatorWinningsPaid(spectatorAddr, payout);
//             }
//         }

//         resetGame();
//     }

//     function resetGame() internal {
//         gameStarted = false;
//         pot = 0;
//         delete communityCards;
//         for (uint8 i = 0; i < playerAddresses.length; i++) {
//             players[playerAddresses[i]].betAmount = 0;
//             players[playerAddresses[i]].hasFolded = false;
//         }
//     }

//     function getCommunityCards() external view returns (uint8[5] memory) {
//         return communityCards;
//     }

//     function getHighestBet() public view returns (uint256) {
//         uint256 highest = 0;
//         for (uint8 i = 0; i < playerAddresses.length; i++) {
//             if (players[playerAddresses[i]].betAmount > highest) {
//                 highest = players[playerAddresses[i]].betAmount;
//             }
//         }
//         return highest;
//     }

//     function getHoleCards() external view returns (uint8[2] memory) {
//         require(players[msg.sender].addr != address(0), "AI player not found");
//         return players[msg.sender].holeCards;
//     }

//     function getPlayerBet(address player) external view returns (uint256) {
//         return players[player].betAmount;
//     }
// }

