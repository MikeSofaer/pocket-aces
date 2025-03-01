"use client";
// import { useState, useEffect } from "react";
// import FrameEmbed from "./farcaster/FrameEmbed";

import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";

// Demo
export default function PokerFrameSeq() {
  const [stage, setStage] = useState(1);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [winner, setWinner] = useState("");
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  const [context, setContext] = useState<unknown>();

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

  const handleBet = (ai: string) => {
    console.log(`Bet placed on ${ai}`);
    setSelectedAI(ai);
    setStage(2);
    setTimeout(() => {
      setStage(3);
    }, 3000); // AI processing simulation for Stage 2
  };

  const handleContinue = () => {
    const winnerAI = Math.random() > 0.5 ? "AI 1" : "AI 2";
    setWinner(winnerAI);
    setStage(4);
  };

  // This is working on warpcast dev playground now
  // Try adding the onClick events in app/tables/page.tsx
  // <div className="bg-green-600 rounded-lg p-6 flex justify-center items-center w-full h-full max-w-screen-md sm:h-80 md:h-96">
  //     <div>This is the tables index: {params.toString()}</div>
  //     <h2 className="font-medium text-base mb-3 text-white/90">
  //       Connect wallet
  //     </h2>
  //     <div>
  //       <h2 className="font-2xl font-bold">Wallet</h2>

  //       {address && (
  //         <div className="my-2 text-xs">
  //           Address: <pre className="inline">{address}</pre>
  //         </div>
  //       )}
  //     </div>
  // TODO make stages into their own components if / when you have time
  return (
    <div className="bg-green-600 rounded-lg p-6 flex justify-center items-center w-full h-full max-w-screen-md sm:h-80 md:h-96">
      {stage === 1 && (
        <div className="text-center">
          {/* Bet on AI */}
          <h1 className="text-3xl font-bold mb-4">Place Your Bets!</h1>
          <button
            onClick={() => handleBet("AI 1")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg mr-4"
          >
            Bet on AI 1
          </button>
          <button
            onClick={() => handleBet("AI 2")}
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
          >
            Bet on AI 2
          </button>
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
          {/* need to map these next */}
          {/* <div>Community Cards {JSON.stringify(communityCards)}</div> */}
          {/* Should be [0, 0, 0, 0, 0] */}
          <div className="flex space-x-3 mb-4 justify-center">
            {["A♠", "A♣", "J♦", "7♠", "10♥"].map((card, index) => (
              <div
                key={index}
                className="w-16 h-24 bg-white text-black rounded-lg shadow-md flex items-center justify-center border-2 border-black text-2xl"
              >
                {card}
              </div>
            ))}
          </div>
          <button
            onClick={handleContinue}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg mt-4"
          >
            Continue
          </button>
          <p>
            Can we get output of what is happening behind the scenes - ai
            actions or events below? pretty console logging?
          </p>
        </div>
      )}

      {stage === 4 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{winner} Wins!</h1>
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
