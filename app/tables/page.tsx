"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";

export default function Page({
  params,
}: {
  params: Promise<{ contract_id: string }>;
}) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

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
    </div>
  );
}
