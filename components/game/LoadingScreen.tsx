import React from "react";

const LoadingScreen = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Game in Progress...</h1>
      <p className="italic">Shuffling cards and preparing AI decisions...</p>
    </div>
  );
};

export default LoadingScreen;
