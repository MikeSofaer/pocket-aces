import React from "react";

interface ShowWinnerProps {
  winner: string;
  onPlayAgain: () => void; // Will be used to reset the game or exit
}

const ShowWinner: React.FC<ShowWinnerProps> = ({ winner, onPlayAgain }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">{winner} Wins!</h1>
      <button
        onClick={onPlayAgain}
        className="bg-yellow-500 text-black px-6 py-3 rounded-lg mt-4"
      >
        Play Again
      </button>
    </div>
  );
};

export default ShowWinner;
