import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const frameMetadata = {
  version: "next",
  imageUrl:
    "https://previews.123rf.com/images/thomaspajot/thomaspajot1101/thomaspajot110100005/8778855-pair-of-aces.jpg",
  button: {
    title: "Place a Bet",
    action: {
      type: "launch_frame",
      name: "View Table",
      url: "https://pocket-aces-michael-sofaers-projects.vercel.app/tables",
      splashImageUrl:
        "https://previews.123rf.com/images/thomaspajot/thomaspajot1101/thomaspajot110100005/8778855-pair-of-aces.jpg",
      splashBackgroundColor: "#000000",
    },
  },
};

export const metadata: Metadata = {
  title: "Pocket Aces",
  description: "Agents All In",
  other: {
    "fc:frame": JSON.stringify(frameMetadata),
    "og:image": frameMetadata.imageUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background dark">
        <Script src="https://cdn.jsdelivr.net/npm/@farcaster/frame-sdk/dist/index.min.js"></Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
