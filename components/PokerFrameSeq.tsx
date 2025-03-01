"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { WalletComponents } from "../components/WalletComponents";
import { mapCommunityCards } from "@/app/utils/card";

// will produce [0,0,0,0,0]
// A♠, A♠, A♠, A♠, A♠
// const contractAddress = "0xb58e3ba3a8eDc77e251A9d094b30fE271139c820";
// will produce [28, 16, 10, 48, 2]
// 3♦, 4♥, J♠, 10♣, 3♠
const contractAddress = "0x9BEEf0b0a88d419b162b0aEb1e91F17467Ea8447";
import { abi } from "../src/TexasHoldem.json";

// Demo
export default function PokerFrameSeq({
  params,
}: {
  params: Promise<{ contract_id: string }>;
}) {
  // from app/tables/pages.tsx
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const { writeContract } = useWriteContract();
  const { address, isConnected } = useAccount();
  const [context, setContext] = useState<unknown>();

  const [stage, setStage] = useState(1);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [winner, setWinner] = useState("");

  const [betAI1, setBetAI1] = useState(false);
  const [betAI2, setBetAI2] = useState(false);

  const { data, isLoading, isError } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "getCommunityCards",
  });

  // Ensure it's an array, otherwise default to an empty array
  const communityCards = Array.isArray(data) ? data : [];
  console.log("Raw communityCards data:", data);

  const spectatorCount = useReadContract({
    abi,
    address: contractAddress,
    functionName: "getSpectatorCount",
  });

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  const handleBet = async (ai: string) => {
    try {
      const contractData =
        ai === "AI 1"
          ? {
              address: contractAddress,
              args: ["0xf0B88B96491f3fCE34C353A5DD9e68E6eFc6b6A8"],
            }
          : {
              address: contractAddress,
              args: ["0x098F822d12d7F0D19c6c01Ff2774FF9b3fDE1e46"],
            };

      if (ai === "AI 1") setBetAI1(true);
      if (ai === "AI 2") setBetAI2(true);

      await writeContract({
        abi,
        address: contractAddress,
        functionName: "joinAsSpectator",
        args: contractData.args,
      });

      console.log(`Bet placed on ${ai} with contract ${contractData.address}`);
    } catch (error) {
      console.error("Error placing bet:", error);
    }
  };

  const handleStartGame = () => {
    setStage(2);
    setTimeout(() => {
      setStage(3);
    }, 2000);
  };

  const handleContinue = () => {
    const winnerAI = Math.random() > 0.5 ? "AI 1" : "AI 2";
    setWinner(winnerAI);
    setStage(4);
  };

  // TODO make stages into their own components if / when you have time
  return (
    <div className="bg-green-600 rounded-lg p-6 flex justify-center items-center w-full h-full max-w-screen-md sm:h-80 md:h-96">
      {stage === 1 && (
        <div className="flex flex-col items-center space-y-4">
          {/* Bet on AI */}
          <h1 className="text-3xl font-bold mb-4">Place Your Bets!</h1>
          <button
            onClick={() => handleBet("AI 1")}
            disabled={betAI1}
            className={`px-6 py-3 rounded-lg text-white font-bold 
              ${
                betAI1
                  ? "bg-gray-400 opacity-50 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {betAI1 ? "Bet Placed" : "Bet on AI 1"}
          </button>
          <button
            onClick={() => handleBet("AI 2")}
            disabled={betAI2}
            className={`px-6 py-3 rounded-lg text-white font-bold 
              ${
                betAI2
                  ? "bg-gray-400 opacity-50 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
          >
            {betAI2 ? "Bet Placed" : "Bet on AI 2"}
          </button>{" "}
          {/* Show "Start Game" only when both bets are placed */}
          {betAI1 && betAI2 && (
            <button
              onClick={handleStartGame}
              className="px-6 py-3 mt-4 rounded-lg text-white font-bold bg-yellow-500 hover:bg-yellow-600"
            >
              Start Game
            </button>
          )}
        </div>
      )}

      {stage === 2 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Game in Progress...</h1>
          <p className="italic">
            Shuffling cards and preparing AI decisions...
          </p>
        </div>
      )}

      {stage === 3 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Revealing Community Cards...
          </h1>
          <div className="flex space-x-3 mb-4 justify-center">
            {isLoading ? (
              <p>Loading cards...</p>
            ) : isError ? (
              <p className="text-red-500">Error loading community cards</p>
            ) : communityCards.length > 0 ? (
              <div className="flex justify-center gap-2">
                {mapCommunityCards(communityCards).map((card, index) => (
                  <div
                    key={index}
                    className="w-16 h-24 bg-white text-black rounded-lg shadow-md flex items-center justify-center border-2 border-black text-2xl"
                  >
                    {card}
                  </div>
                ))}
              </div>
            ) : (
              <p>No community cards available</p>
            )}
          </div>
          <button
            onClick={handleContinue}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg mt-4"
          >
            Continue
          </button>
          {/* <p>
            Can we get output of what is happening behind the scenes - ai
            actions or events below? pretty console logging?
          </p> */}
        </div>
      )}

      {stage === 4 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{winner} Wins!</h1>
          {/* Maybe just exit the frame at this point or reset the buttons in stage 1 */}
          <button
            onClick={() => setStage(1)}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg mt-4"
          >
            Play Again
          </button>
        </div>
      )}

      {/* <FrameEmbed src="https://your-farcaster-frame-url.com" /> */}
    </div>
  );
}
