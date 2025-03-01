import React from "react";

interface PokerTableLayoutProps {
  children: React.ReactNode;
}

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
