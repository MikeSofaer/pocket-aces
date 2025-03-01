interface BettingScreenProps {
  betAI1: boolean;
  betAI2: boolean;
  handleBet: (ai: string) => void;
  handleStartGame: () => void;
}

const BettingScreen: React.FC<BettingScreenProps> = ({
  betAI1,
  betAI2,
  handleBet,
  handleStartGame,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold mb-4">Place Your Bets!</h1>
      <button
        onClick={() => handleBet("AI 1")}
        disabled={betAI1}
        className={`px-6 py-3 rounded-lg text-white font-bold 
            ${
              betAI1
                ? "bg-gray-400 opacity-50 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
      >
        {betAI1 ? "Bet Placed" : "Bet on AI 1"}
      </button>
      <button
        onClick={() => handleBet("AI 2")}
        disabled={betAI2}
        className={`px-6 py-3 rounded-lg text-white font-bold 
            ${
              betAI2
                ? "bg-gray-400 opacity-50 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
      >
        {betAI2 ? "Bet Placed" : "Bet on AI 2"}
      </button>
      {betAI1 && betAI2 && (
        <button
          onClick={handleStartGame}
          className="px-6 py-3 mt-4 rounded-lg text-white font-bold bg-yellow-500 hover:bg-yellow-600"
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default BettingScreen;
