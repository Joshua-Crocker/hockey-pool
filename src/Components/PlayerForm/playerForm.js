import React, { useState, useEffect } from 'react';

const PlayerForm = ({ onSavePicks }) => {
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [fridayPicks, setFridayPicks] = useState([]);
    const [saturdayPicks, setSaturdayPicks] = useState([]);
    const [sundayPicks, setSundayPicks] = useState([]);
    const [playerList, setPlayerList] = useState([]);
    const [playersData, setPlayersData] = useState([]);
    const [gameResults, setGameResults] = useState(null);

    useEffect(() => {
        // Fetch Players
        fetch('/api/handler')
            .then(response => response.json())
            .then(data => {
                setPlayersData(data);
                const activePlayers = data.map(player => player.name);
                setPlayerList([
                    "Joshua", "Fadder", "Jon Loder", "Andrew", "Wrinkles",
                    "Bunsey", "Dean/JD", "Adam", "Sadie", "Landon",
                    "Clifford", "Dave Rawding", "Darryl", "Mike Greely", "Rod",
                    "JD Squad", "Pat", "Frank", "MacKenzie", "Rick"
                ].filter(player => !activePlayers.includes(player)));
            })
            .catch(error => console.error('Error fetching player data:', error));

        // Fetch Game Schedule (Game Results)
        fetch('/gameResults.json')
            .then(response => response.json())
            .then(data => setGameResults(data))
            .catch(error => console.error('Error fetching game results:', error));
    }, []);

    const handlePickChange = (day, index, value) => {
        const updatePicks = (dayPicks, setDayPicks) => {
            const updatedPicks = [...dayPicks];
            updatedPicks[index] = { game: gameResults[day][index].game, pick: value };
            setDayPicks(updatedPicks);
        };
        if (day === "friday") updatePicks(fridayPicks, setFridayPicks);
        if (day === "saturday") updatePicks(saturdayPicks, setSaturdayPicks);
        if (day === "sunday") updatePicks(sundayPicks, setSundayPicks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gameResults) {
            alert("Game results not loaded yet.");
            return;
        }

        // Check if all picks are filled
        const isAllPicksComplete = (picks, day) =>
            picks.length === gameResults[day].length && picks.every(pick => pick?.pick);

        if (!selectedPlayer ||
            !isAllPicksComplete(fridayPicks, "friday") ||
            !isAllPicksComplete(saturdayPicks, "saturday") ||
            !isAllPicksComplete(sundayPicks, "sunday")) {
            alert("Please complete all picks for each game and select a player name.");
            return;
        }

        const data = {
            name: selectedPlayer,
            fridayPicks,
            saturdayPicks,
            sundayPicks
        };

        console.log("Picks being saved:", JSON.stringify(data, null, 2));

        try {
            const response = await fetch('/api/handler', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error(`Error saving picks: ${response.statusText}`);

            const result = await response.json();
            console.log(result.message);
            onSavePicks(data);

            // Reset form
            setSelectedPlayer('');
            setFridayPicks([]);
            setSaturdayPicks([]);
            setSundayPicks([]);
        } catch (error) {
            console.error('Error saving picks:', error);
        }
    };

    return (
        <div className="player-form">
            <h2 className="form-title">Player Picks</h2>
            {playerList.length > 0 ? (
                gameResults ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Player:</label>
                            <select
                                onChange={(e) => setSelectedPlayer(e.target.value)}
                                value={selectedPlayer}
                                className="player-select"
                            >
                                <option value="">Choose Player</option>
                                {playerList.map(player => (
                                    <option key={player} value={player}>{player}</option>
                                ))}
                            </select>
                        </div>

                        {Object.entries(gameResults).map(([day, games]) => (
                            <div key={day} className="day-section">
                                <h3 className="day-title">{day.charAt(0).toUpperCase() + day.slice(1)}'s Games</h3>
                                {games.map((game, index) => (
                                    <div key={index} className="game-item">
                                        <label className="game-label">{game.game}</label>
                                        <select
                                            onChange={(e) => handlePickChange(day, index, e.target.value)}
                                            value={
                                                day === "friday" ? fridayPicks[index]?.pick :
                                                day === "saturday" ? saturdayPicks[index]?.pick :
                                                sundayPicks[index]?.pick || ""
                                            }
                                            className="game-select"
                                        >
                                            <option value="">Select Winner</option>
                                            <option value={game.game.split(" vs ")[0]}>
                                                {game.game.split(" vs ")[0]}
                                            </option>
                                            <option value={game.game.split(" vs ")[1]}>
                                                {game.game.split(" vs ")[1]}
                                            </option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <button type="submit" className="submit-button">Save Picks</button>
                    </form>
                ) : (
                    <p>Loading game schedule...</p>
                )
            ) : (
                <p>The first game has started, no more picks allowed.</p>
            )}
        </div>
    );
}

export default PlayerForm;
