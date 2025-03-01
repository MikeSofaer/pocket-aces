import React from "react";
import { mapCommunityCards } from "@/app/utils/card";

interface RevealCardsProps {
  communityCards: number[];
  isLoading: boolean;
  isError: boolean;
  handleContinue: () => void;
}

const RevealCards: React.FC<RevealCardsProps> = ({
  communityCards,
  isLoading,
  isError,
  handleContinue,
}) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Revealing Community Cards...</h1>
      <div className="flex space-x-3 mb-4 justify-center">
        {isLoading ? (
          <p>Loading cards...</p>
        ) : isError ? (
          <p className="text-red-500">Error loading community cards</p>
        ) : communityCards.length > 0 ? (
          <div className="flex justify-center gap-2">
            {mapCommunityCards(communityCards).map((card, index) => (
              <div
                key={index}
                className="w-16 h-24 bg-white text-black rounded-lg shadow-md flex items-center justify-center border-2 border-black text-2xl"
              >
                {card}
              </div>
            ))}
          </div>
        ) : (
          <p>No community cards available</p>
        )}
      </div>
      <button
        onClick={handleContinue}
        className="bg-yellow-500 text-black px-6 py-3 rounded-lg mt-4"
      >
        Continue
      </button>
    </div>
  );
};

export default RevealCards;
