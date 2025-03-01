// const suits = ["♠", "♣", "♦", "♥"];
const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export const mapCommunityCards = (cardIndices: number[]) => {
  return cardIndices.map((index) => {
    const suit = suits[Math.floor(index / 13)];
    const rank = ranks[index % 13];
    return `${rank}${suit}`;
  });
};
