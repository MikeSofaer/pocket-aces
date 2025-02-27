"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { useWriteContract } from "wagmi";

const abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

export default function Page({
  params,
}: {
  params: Promise<{ contract_id: string }>;
}) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const { writeContract } = useWriteContract();

  // Initialize Frame SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Tell the parent Farcaster client that our frame is ready
        await sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (error) {
        console.error("Failed to initialize Frame SDK:", error);
      }
    };

    if (!isSDKLoaded) {
      initializeSDK();
    }
  }, [isSDKLoaded]);
  console.log(params);
  return (
    <div>
      <script>console.log(0); await frame.sdk.actions.ready();</script>
      <div>This is the tables index: {params.toString()}</div>
      <button
        onClick={() =>
          writeContract({
            abi,
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            functionName: "placeBet",
            args: ["1"],
          })
        }
      >
        Bet on AI 1
      </button>
      <br />
      <button
        onClick={() =>
          writeContract({
            abi,
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            functionName: "placeBet",
            args: ["2"],
          })
        }
      >
        Bet on AI 2
      </button>
    </div>
  );
}
