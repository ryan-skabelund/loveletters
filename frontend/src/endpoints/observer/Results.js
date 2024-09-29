import React from 'react';
import './Results.css';  // Assume you have some basic styles defined here
import { useGameState } from "../../state/GameState";

function Results() {
  const { players } = useGameState();

  return (
    <div className="Results">
      <h2>Results</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.name}: {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Results;
