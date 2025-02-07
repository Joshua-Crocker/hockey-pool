import React from "react";

const Leaderboard = ({ leaderboard }) => (
  <table className="leaderboard-table">
    <thead>
      <tr>
        <th>Player</th>
        <th>Games Played</th>
        <th>Games Won</th>
        <th>Win Percentage</th>
      </tr>
    </thead>
    <tbody>
      {leaderboard.map((player, index) => (
        <tr key={index}>
          <td>{player.name}</td>
          <td>{player.gamesPlayed}</td>
          <td>{player.timesWon}</td>
          <td>{player.winPercentage}%</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Leaderboard;