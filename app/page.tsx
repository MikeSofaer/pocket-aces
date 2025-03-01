"use client";

import dynamic from "next/dynamic";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";

import PokerTableLayout from "@/components/PokerTableLayout";
// No Server Side Rendering
// const Demo = dynamic(() => import("~/components/Demo"), {
// or is this supposed to be in app/tables/page.tsx ?
const PokerFrameSeq = dynamic(() => import("@/components/PokerFrameSeq"), {
  ssr: false,
});

const components = [
  {
    name: "Transaction",
    url: "https://onchainkit.xyz/transaction/transaction",
  },
  { name: "Swap", url: "https://onchainkit.xyz/swap/swap" },
  { name: "Checkout", url: "https://onchainkit.xyz/checkout/checkout" },
  { name: "Wallet", url: "https://onchainkit.xyz/wallet/wallet" },
  { name: "Identity", url: "https://onchainkit.xyz/identity/identity" },
];

const templates = [
  { name: "NFT", url: "https://github.com/coinbase/onchain-app-template" },
  {
    name: "Commerce",
    url: "https://github.com/coinbase/onchain-commerce-template",
  },
  { name: "Fund", url: "https://github.com/fakepixels/fund-component" },
];

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-end">
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start py-16">
        <div className="max-w-4xl w-full p-4 text-center">
          <h1 className="text-4xl font-bold">Pocket Aces</h1>
          <h2 className="text-lg text-gray-500">Farcaster Frame Demo</h2>
          <div className="mt-6 flex justify-center">
            {/* <div className="mt-6 flex justify-center w-full h-full"> */}
            {/* Use ngrok to test a deployed frame? */}
            {/* <FrameEmbed src="https://warpcast.com/~/developers/frames?fc_api=1" /> */}
            <PokerTableLayout>
              <PokerFrameSeq />
            </PokerTableLayout>
          </div>
        </div>
      </main>
    </div>
  );
}
