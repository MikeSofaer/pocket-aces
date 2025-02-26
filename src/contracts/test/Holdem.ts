import { ethers } from "hardhat";
import { expect } from "chai";
import { TexasHoldem, Deck, PokerHandEvaluator, TestPokerHandEvaluator} from "../typechain-types";
import { Signer, toNumber } from "ethers";

describe("TexasHoldem Contract", function () {
  let holdem: TexasHoldem;
  let deck: Deck;
  let owner: Signer, player1: Signer, player2: Signer;
  let player1Address: string, player2Address: string;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    player1Address = await player1.getAddress();
    player2Address = await player2.getAddress();

    // Deploy the PokerHandEvaluator
    const PokerHandEvaluatorFactory = await ethers.getContractFactory("PokerHandEvaluator");
    const pokerHandEvaluator = await PokerHandEvaluatorFactory.deploy();
    await pokerHandEvaluator.waitForDeployment();

    // Deploy the Deck contract 
    const DeckFactory = await ethers.getContractFactory("Deck");
    deck = (await DeckFactory.deploy()) as Deck;
    await deck.waitForDeployment();

    // Get the library address
    const pokerHandEvaluatorAddress = await pokerHandEvaluator.getAddress();  

    // Deploy TexasHoldem with the Deck contract address
    const HoldemFactory = await ethers.getContractFactory("TexasHoldem", {
        libraries: {
          PokerHandEvaluator: pokerHandEvaluatorAddress,
        },
      });
    
      holdem = (await HoldemFactory.deploy(await deck.getAddress())) as TexasHoldem;
      await holdem.waitForDeployment();
  });
  //Join Game Tests
  it("should allow players to join the game with a bet", async function () {
    const betAmount = ethers.parseEther("2");

    await expect(holdem.connect(player1).joinGame({ value: betAmount }))
      .to.emit(holdem, "JoinedGame")
      .withArgs(player1Address, betAmount);

    await expect(holdem.connect(player2).joinGame({ value: betAmount }))
      .to.emit(holdem, "JoinedGame")
      .withArgs(player2Address, betAmount);

    expect(await ethers.provider.getBalance(holdem.getAddress())).to.equal(
      betAmount * BigInt(2)
    );
  });
  //Start Game Tests
  it("should start the game when there are enough players", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await expect(holdem.connect(owner).startGame()).to.emit(holdem, "GameStarted");

    expect(await holdem.gameStarted()).to.equal(true);
  });

  it("should not start the game with only one player", async function () {
    const betAmount = ethers.parseEther("2");
    await holdem.connect(player1).joinGame({ value: betAmount });

    await expect(holdem.connect(owner).startGame())
        .to.be.revertedWith("Not enough players");
  });


  it("should deal hole cards to players", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });
    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    await expect(holdem.connect(owner).dealCards()).to.emit(holdem, "CardsDealt");

    // Fetch hole cards for both players (returns a tuple of two values)
    const [player1Card1, player1Card2] = await holdem.connect(player1).getHoleCards();
    const [player2Card1, player2Card2] = await holdem.connect(player2).getHoleCards();

    // Convert to proper arrays for assertion
    const player1Ranks = [player1Card1, player1Card2];
    const player2Ranks = [player2Card1, player2Card2];

    // Assertions
    expect(player1Ranks).to.be.an("array");
    expect(player1Ranks.length).to.equal(2);
    expect(player2Ranks).to.be.an("array");
    expect(player2Ranks.length).to.equal(2);
  });

  it("should not allow new players to join after the game starts", async function () {
    const betAmount = ethers.parseEther("2");
    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();

    const player3 = (await ethers.getSigners())[3];
    await expect(holdem.connect(player3).joinGame({ value: betAmount }))
        .to.be.revertedWith("Game already started");
  });

  it("should not allow a player to bet before the game starts", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });

    await expect(holdem.connect(player1).placeBet({ value: betAmount }))
        .to.be.revertedWith("Game has not started");
});


  // Winner Tests
  it("should declare a winner and transfer the pot", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });
    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    const initialBalancePlayer1 = await ethers.provider.getBalance(player1Address);
    const initialBalancePlayer2 = await ethers.provider.getBalance(player2Address);

    await expect(holdem.connect(owner).declareWinner()).to.emit(holdem, "WinnerDeclared");

    const finalBalancePlayer1 = await ethers.provider.getBalance(player1Address);
    const finalBalancePlayer2 = await ethers.provider.getBalance(player2Address);

    // Ensure pot is transferred to the winner (one player's balance increases)
    expect(
      finalBalancePlayer1 > initialBalancePlayer1 || finalBalancePlayer2 > initialBalancePlayer2
    ).to.be.true;
  });

  //Raise function tests
  it("should allow a player to raise the bet correctly", async function () {
    const initialBet = ethers.parseEther("2");
    const raiseAmount = ethers.parseEther("1");


    // Player 1 joins and places initial bet
    await holdem.connect(player1).joinGame({ value: initialBet });
    // Player 2 joins and places initial bet
    await holdem.connect(player2).joinGame({ value: initialBet });

    // Start the game and deal cards
    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places initial bet
    await holdem.connect(player1).placeBet({ value: initialBet });      




    // Player 2 calls the initial bet
    await holdem.connect(player2).callBet({ value: initialBet });
   
    // Player 1 raises the bet
    await holdem.connect(player1).raiseBet(raiseAmount, { value: raiseAmount });

    // ✅ Ensure the highest bet is now updated
    const highestBet = await holdem.getHighestBet();
    expect(highestBet).to.equal(initialBet + raiseAmount);

    // ✅ Ensure the player's total bet reflects the raise
    const player1Bet = await holdem.getPlayerBet(player1Address);
    expect(player1Bet).to.equal(initialBet + raiseAmount);
  });

  it("should not allow betting after a winner is declared", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    await holdem.connect(player1).placeBet({ value: betAmount });
    await holdem.connect(player2).fold();

    await holdem.connect(owner).declareWinner();

    await expect(
        holdem.connect(player1).raiseBet(ethers.parseEther("1"), { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Not an active player");
  });

  it("should reset the pot after the game ends", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    await holdem.connect(player1).placeBet({ value: betAmount });
    await holdem.connect(player2).fold();

    await holdem.connect(owner).declareWinner();

    const pot = await holdem.pot();
    expect(pot).to.equal(0);
  });


  it("should only allow one player to place the initial bet", async function () {
    const betAmount = ethers.parseEther("2");
    const initialBet = ethers.parseEther("2");

    // Player 1 joins and places initial bet
    await holdem.connect(player1).joinGame({ value: initialBet });
    // Player 2 joins and places initial bet
    await holdem.connect(player2).joinGame({ value: initialBet });

    // Start the game and deal cards
    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places the first bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 tries to place another initial bet (should fail)
    await expect(
        holdem.connect(player2).placeBet({ value: betAmount })
    ).to.be.revertedWith("A bet has already been placed. Use call, raise, or fold.");
  });

  //Call function tests
  it("should allow a player to call a bet", async function () {
    const betAmount = ethers.parseEther("2");

    // Player 1 joins and places the initial bet
    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places initial bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 calls the bet
    await expect(
        holdem.connect(player2).callBet({ value: betAmount })
    ).to.emit(holdem, "BetPlaced").withArgs(player2Address, betAmount);

    // ✅ Ensure the highest bet is still the initial bet
    const highestBet = await holdem.getHighestBet();
    expect(highestBet).to.equal(betAmount);

    // ✅ Ensure Player 2's total bet matches the initial bet
    const player2Bet = await holdem.getPlayerBet(player2Address);
    expect(player2Bet).to.equal(betAmount);
  });

  it("should not allow a player to call with an incorrect amount", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places an initial bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 tries to overpay when calling (should fail)
    await expect(
        holdem.connect(player2).callBet({ value: betAmount + ethers.parseEther("1") })
    ).to.be.revertedWith("Incorrect call amount");

    // Player 2 tries to underpay when calling (should fail)
    await expect(
        holdem.connect(player2).callBet({ value: betAmount - ethers.parseEther("0.5") })
    ).to.be.revertedWith("Incorrect call amount");
  });

  it("should not allow a player to call with an incorrect amount", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places an initial bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 tries to overpay when calling (should fail)
    await expect(
        holdem.connect(player2).callBet({ value: betAmount + ethers.parseEther("1") })
    ).to.be.revertedWith("Incorrect call amount");

    // Player 2 tries to underpay when calling (should fail)
    await expect(
        holdem.connect(player2).callBet({ value: betAmount - ethers.parseEther("0.5") })
    ).to.be.revertedWith("Incorrect call amount");
  });

  it("should not allow a player to call if they already matched the bet", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places initial bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 calls the bet
    await holdem.connect(player2).callBet({ value: betAmount });

    // Player 2 tries to call again (should fail)
    await expect(
        holdem.connect(player2).callBet({ value: betAmount })
    ).to.be.revertedWith("Incorrect call amount");
  });

  //Fold function tests
  it("should allow a player to fold", async function () {
    const betAmount = ethers.parseEther("2");

    // Players join
    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places an initial bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 folds
    await expect(holdem.connect(player2).fold())
        .to.emit(holdem, "PlayerFolded")
        .withArgs(player2Address);

    // Ensure Player 2 is marked as folded
    const { hasFolded } = await holdem.players(player2Address);
    expect(hasFolded).to.be.true;
  });

  it("should prevent a folded player from betting", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 2 folds
    await holdem.connect(player2).fold();

    // Player 2 tries to place a bet (should fail)
    await expect(
        holdem.connect(player2).placeBet({ value: betAmount })
    ).to.be.revertedWith("Player has folded");

    // Player 2 tries to call a bet (should fail)
    await expect(
        holdem.connect(player2).callBet({ value: betAmount })
    ).to.be.revertedWith("Player has folded");

    // Player 2 tries to raise a bet (should fail)
    await expect(
        holdem.connect(player2).raiseBet(ethers.parseEther("1"), { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Player has folded");
  });

  it("should continue the game after a player folds", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places a bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 folds
    await holdem.connect(player2).fold();

    // Player 1 should still be able to continue playing
    await expect(holdem.connect(player1).raiseBet(ethers.parseEther("1"), { value: ethers.parseEther("1") }))
        .to.emit(holdem, "BetPlaced");
  });

  it("should declare the remaining player as the winner if all others fold", async function () {
    const betAmount = ethers.parseEther("2");

    await holdem.connect(player1).joinGame({ value: betAmount });
    await holdem.connect(player2).joinGame({ value: betAmount });

    await holdem.connect(owner).startGame();
    await holdem.connect(owner).dealCards();

    // Player 1 places a bet
    await holdem.connect(player1).placeBet({ value: betAmount });

    // Player 2 folds
    await holdem.connect(player2).fold();
    

    // Declare winner (should be player1 since they are the only active player)
    await expect(holdem.connect(owner).declareWinner())
        .to.emit(holdem, "WinnerDeclared")
        .withArgs(player1Address, betAmount * BigInt(3)); // Pot should be 2x buy-in
  });


});

describe("Deck", function () {
    let Deck: Deck;
  
    before(async function () {
      const DeckContract = await ethers.getContractFactory("Deck");
      Deck = await DeckContract.deploy();
    });
  
    it("should shuffle the deck without errors", async function () {
      await expect(Deck.shuffleDeck()).to.not.be.reverted;
    });
  
    it("should allow drawing a card", async function () {
        await Deck.drawCard(); // No need to capture return value
        const card = await Deck.lastDrawnCard(); // Read from state
        expect(card).to.be.within(1, 52);
      });
  
    it("should correctly return a readable card string", async function () {
      const expectedCardStrings = {
        1: "Ace of Clubs",
        2: "2 of Clubs",
        3: "3 of Clubs",
        13: "King of Clubs",
        14: "Ace of Diamonds",
        26: "King of Diamonds",
        27: "Ace of Hearts",
        39: "King of Hearts",
        40: "Ace of Spades",
        52: "King of Spades",
      };
  
      for (const [index, expectedString] of Object.entries(expectedCardStrings)) {
        const cardString = await Deck.getCardString(Number(index));
        expect(cardString).to.equal(expectedString);
      }
    });
  
    it("should not allow an invalid card index", async function () {
      await expect(Deck.getCardString(53)).to.be.revertedWith("Invalid card index");
    });
  });

  describe("PokerHandEvaluator", function () {
    let PokerHandEvaluator: TestPokerHandEvaluator;

    before(async function () {
        // Deploy the PokerHandEvaluator library
        const PokerHandEvaluatorLib = await ethers.getContractFactory("PokerHandEvaluator");
        const pokerHandEvaluator = await PokerHandEvaluatorLib.deploy();
      
        // Deploy TestPokerHandEvaluator with the linked library
        const TestPokerHandEvaluator = await ethers.getContractFactory("TestPokerHandEvaluator", {
          libraries: {
            PokerHandEvaluator: pokerHandEvaluator.target, // ✅ Correct linking syntax
          },
        });
      
        PokerHandEvaluator = await TestPokerHandEvaluator.deploy();
      });
      
      
    it("should correctly identify a Royal Flush", async function () {
        const hand = [40, 49, 50, 51, 52] as [number, number, number, number, number]; 
        const result = await PokerHandEvaluator.evaluateHand(hand);
        const { rank, highestCard } = result; // Destructure result
        console.log("Royal Flush result:", result); // Debugging
        expect(rank).to.equal(9); // Royal Flush
    });
  
    it("should correctly identify a Straight Flush", async function () {
      const hand = [35, 36, 37, 38, 39] as [number, number, number, number, number]; // 9 to King of Hearts
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(8); // Straight Flush
    });
  
    it("should correctly identify Four of a Kind", async function () {
      const hand = [3, 16, 29, 42, 10] as [number, number, number, number, number]; // Four Threes and a 10 kicker
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(7); // Four of a Kind
    });
  
    it("should correctly identify a Full House", async function () {
      const hand = [1, 14, 28, 2, 15] as [number, number, number, number, number]; // Three Aces and Two Twos
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(6); // Full House
    });
  
    it("should correctly identify a Flush", async function () {
      const hand = [4, 8, 12, 7, 6] as [number, number, number, number, number]; // Random 5 Clubs
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(5); // Flush
    });
  
    it("should correctly identify a Straight", async function () {
      const hand = [5, 19, 33, 47, 9] as [number, number, number, number, number]; // 5-6-7-8-9 of mixed suits
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(4); // Straight
    });
  
    it("should correctly identify a Three of a Kind", async function () {
      const hand = [6, 19, 32, 9, 23] as [number, number, number, number, number]; // Three Sixes and two kickers
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(3); // Three of a Kind
    });

    it("should correctly identify Two Pair", async function () {
      const hand = [7, 7, 8, 21, 9] as [number, number, number, number, number]; // Two Sevens and Two Eights
      const result = await PokerHandEvaluator.evaluateHand(hand);
      console.log("DEBUG Two Pair:", result.rank.toString()); // Check what is being returned
      expect(result.rank).to.equal(2); // Two Pair
    });

    it("should correctly identify One Pair", async function () {
      const hand = [7, 20, 21, 22, 23] as [number, number, number, number, number]; // One Pair of Eights
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(1); // One Pair
    });
  
    it("should correctly identify a High Card", async function () {
      const hand = [2, 6, 10, 18, 26] as [number, number, number, number, number]; // No pairs, no straight, no flush
      const result = await PokerHandEvaluator.evaluateHand(hand);
      expect(result.rank).to.equal(0); // High Card
    });
  });
