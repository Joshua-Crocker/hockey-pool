import React from "react";
import { gameResults } from "../GameResults/gameResults";


const renderPick = (pickData, results) => {
  const gameResult = results.find((result) => result.game === pickData.game);
  const isWinner = gameResult && gameResult.winner === pickData.pick;
  return (
    <div key={pickData.game} className="game-pick">
      {pickData.game}: <strong className={isWinner ? "highlight-winner" : ""}>{pickData.pick}</strong>
    </div>
  );
};

const PlayerTable = ({ playersData, expandedRows, toggleRow }) => (
  <table className="picks-table">
    <thead>
      <tr>
        <th>Player</th>
        <th>Friday Picks</th>
        <th>Saturday Picks</th>
        <th>Sunday Picks</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {playersData.map((player, index) => (
        <React.Fragment key={index}>
          <tr>
            <td>{player.name}</td>
            <td>{player.fridayPicks.map((pick) => renderPick(pick, gameResults.friday))}</td>
            <td>{player.saturdayPicks.map((pick) => renderPick(pick, gameResults.saturday))}</td>
            <td>{player.sundayPicks.map((pick) => renderPick(pick, gameResults.sunday))}</td>
            <td><button onClick={() => toggleRow(index)}>{expandedRows[index] ? "Show Less" : "Show More"}</button></td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
);

export default PlayerTable;