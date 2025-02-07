import React, { useState, useEffect } from "react";
import "./App.css";
import PlayerForm from "./Components/PlayerForm/playerForm";
import PlayerTable from "./Components/PlayerTable/playerTable";
import Leaderboard from "./Components/Leaderboard/leaderboard";
import { calculateWins } from "./Components/Utils/utils";

function App() {
  const [playersData, setPlayersData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [gameResults, setGameResults] = useState({});

  useEffect(() => {
    // Fetch gameResults dynamically (from API, JSON, or other sources)
    fetch("/gameResults.json")
      .then((response) => response.json())
      .then((data) => setGameResults(data))
      .catch((error) => console.error("Error loading game results:", error));

    fetch("/api/handler")
      .then((response) => response.json())
      .then((data) => setPlayersData(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const leaderboard = playersData.map((player) => {
    const gamesPlayed = ["friday", "saturday", "sunday"].reduce(
      (total, day) => total + (player[`${day}Picks`] || []).length,
      0
    );
    const timesWon = calculateWins(player, gameResults);
    const winPercentage = gamesPlayed > 0 ? ((timesWon / gamesPlayed) * 100).toFixed(2) : 0;
    return { name: player.name, gamesPlayed, timesWon, winPercentage };
  });

  return (
    <div className="App">
      <h1 className="app-title">Hockey Pool</h1>
      <PlayerForm onSavePicks={(newPicks) => setPlayersData(newPicks)} />
      <PlayerTable playersData={playersData} expandedRows={expandedRows} toggleRow={toggleRow} gameResults={gameResults} />
      <h2 className="leaderboard-title">Leaderboard</h2>
      <Leaderboard leaderboard={leaderboard} />
    </div>
  );
}

export default App;
