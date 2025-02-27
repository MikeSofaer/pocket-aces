import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NEXT_PUBLIC_URL } from "./config";

const frameMetadata = {
  version: "next",
  imageUrl:
    "https://previews.123rf.com/images/thomaspajot/thomaspajot1101/thomaspajot110100005/8778855-pair-of-aces.jpg",
  button: {
    title: "Pocket Aces",
    action: {
      type: "launch_frame",
      name: "Create Table",
      url: "https://ock-frames-template.vercel.app",
      splashImageUrl: "https://ock-frames-template.vercel.app/splash.png",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
