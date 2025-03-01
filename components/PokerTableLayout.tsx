import React from "react";

interface PokerTableLayoutProps {
  children: React.ReactNode;
}

// This might not be in the correct location
// let's just put in a placeholder,
// Since our frame app will be rendering at mobile width,
//   we'll give it a fixed width and center the content:
// Farcaster demo from docs - mobile only
//<div className="w-[300px] mx-auto py-4 px-2">
//<h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>
// </div>
const PokerTableLayout: React.FC<PokerTableLayoutProps> = ({ children }) => {
  return (
    <div className="mt-6 flex justify-center w-full h-screen">
      {/* Fixed height container for the poker table */}
      <div className="bg-green-600 rounded-lg p-6 flex flex-col justify-center items-center w-full max-w-screen-md h-[500px] sm:h-[500px] md:h-[500px] lg:h-[600px]">
        {/* The content of the current stage */}
        {children}
      </div>
    </div>
  );
};

export default PokerTableLayout;
