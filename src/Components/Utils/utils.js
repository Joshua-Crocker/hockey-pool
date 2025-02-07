export const calculateWins = (playerPicks, gameResults) => {
    let wins = 0;
    ["friday", "saturday", "sunday"].forEach((day) => {
      if (!playerPicks[`${day}Picks`] || !gameResults[day]) return;
      playerPicks[`${day}Picks`].forEach((pick) => {
        const gameResult = gameResults[day].find(
          (result) => result.game === pick.game
        );
        if (gameResult && gameResult.winner === pick.pick) {
          wins++;
        }
      });
    });
    return wins;
  };