"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { WalletComponents } from "../../components/WalletComponents";

const contractAddress = "0xb58e3ba3a8eDc77e251A9d094b30fE271139c820";
import { abi } from "../../src/TexasHoldem.json";

export default function Page({
  params,
}: {
  params: Promise<{ contract_id: string }>;
}) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const { writeContract } = useWriteContract();
  const { address, isConnected } = useAccount();

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

  const communityCards = useReadContract({
    abi,
    address: contractAddress,
    functionName: "getCommunityCards",
  });

  const spectatorCount = useReadContract({
    abi,
    address: contractAddress,
    functionName: "getSpectatorCount",
  });

  return (
    <div>
      <div>This is the tables index: {params.toString()}</div>
      <h2 className="font-medium text-base mb-3 text-white/90">
        Connect wallet
      </h2>
      <div>
        <h2 className="font-2xl font-bold">Wallet</h2>

        {address && (
          <div className="my-2 text-xs">
            Address: <pre className="inline">{address}</pre>
          </div>
        )}
      </div>
      <button
        onClick={() =>
          writeContract({
            abi,
            address: contractAddress,
            functionName: "joinAsSpectator",
            args: ["0xf0B88B96491f3fCE34C353A5DD9e68E6eFc6b6A8"],
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
            address: contractAddress,
            functionName: "joinAsSpectator",
            args: ["0x098F822d12d7F0D19c6c01Ff2774FF9b3fDE1e46"],
          })
        }
      >
        Bet on AI 2
      </button>
      <div>Community Cards {JSON.stringify(communityCards)}</div>
      <div>Spectator Count {spectatorCount.data}</div>
    </div>
  );
}
