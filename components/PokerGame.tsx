"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { useWriteContract, useAccount, useReadContract } from "wagmi";

// will produce [0,0,0,0,0]
// A♠, A♠, A♠, A♠, A♠
// const contractAddress = "0xb58e3ba3a8eDc77e251A9d094b30fE271139c820";
// will produce [28, 16, 10, 48, 2]
// 3♦, 4♥, J♠, 10♣, 3♠
const contractAddress = "0x9BEEf0b0a88d419b162b0aEb1e91F17467Ea8447";
import { abi } from "../src/TexasHoldem.json";
import BettingScreen from "./game/BettingScreen";
import LoadingScreen from "./game/LoadingScreen";
import RevealCards from "./game/RevealCards";
import ShowWinner from "./game/ShowWinner";

// Demo
// export default function PokerFrameSeq({
//   params,
// }: {
//   params: Promise<{ contract_id: string }>;
// }) {
interface PokerGameProps {
  contractId: string;
}

const PokerGame = ({ contractId }: PokerGameProps) => {
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

  const handlePlayAgain = () => {
    // Reset the bets when starting over
    setBetAI1(false);
    setBetAI2(false);
    setWinner(""); // Reset winner
    setStage(1); // Go back to Stage 1  for a new game
    // sdk.actions.close(); // To close frame ?
  };
  return (
    <div className="bg-green-600 rounded-lg p-6 flex justify-center items-center w-full h-full max-w-screen-md sm:h-80 md:h-96">
      {stage === 1 && (
        <BettingScreen
          betAI1={betAI1}
          betAI2={betAI2}
          handleBet={handleBet}
          handleStartGame={handleStartGame}
        />
      )}

      {stage === 2 && <LoadingScreen />}

      {stage === 3 && (
        <RevealCards
          communityCards={communityCards}
          isLoading={isLoading}
          isError={isError}
          handleContinue={handleContinue}
        />
      )}

      {stage === 4 && (
        <ShowWinner winner={winner} onPlayAgain={handlePlayAgain} />
      )}

      {/* <FrameEmbed src="https://your-farcaster-frame-url.com" /> */}
    </div>
  );
};

export default PokerGame;
