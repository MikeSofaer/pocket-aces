// Placeholder for now just mocking something for now, can do svgs
// TODO maybe simulate interactions with useState? rendering different visuals
export default function PokerFrame() {
  const cards = [
    { value: "A", suit: "♠️" },
    { value: "Q", suit: "♦️" },
    { value: "K", suit: "♦️" },
    { value: "J", suit: "♣️" },
    { value: "10", suit: "♣️" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-700 p-6">
      <h1 className="text-white text-3xl font-bold mb-4">Poker Hand</h1>
      <div className="flex space-x-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-16 h-24 bg-white text-black rounded-lg shadow-md flex flex-col items-center justify-center border-2 border-black"
          >
            <span className="text-xl font-bold">{card.value}</span>
            <span className="text-lg">{card.suit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
