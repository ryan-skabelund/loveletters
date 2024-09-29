import React from 'react';
import { ServerIcon, UsersIcon } from "lucide-react";
import { useGameState } from "../../state/GameState";
import './Pregame.css';

import qrcode from '../../components/qr-code.png';

function Pregame() {
    const { sendToServer, players, max_players } = useGameState();

    const startGame = () => {
        sendToServer("start_game");
    };
    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="dashboard-header">
                    <ServerIcon className="dashboard-icon" />
                    <h1 className="dashboard-title">Server Dashboard</h1>
                </div>
                <div className="game-status">
                    <div className="status-header">
                        <UsersIcon className="status-icon" />
                        <h2 className="status-title">Game Status</h2>
                    </div>
                    <p className="status-message">
                        <span className="status-indicator" aria-hidden="true"></span>
                        <span className="visually-hidden">Current status:</span>
                        Current Game State: <span className="status-text">Waiting for players ({`${Object.keys(players).length}/${max_players}`})</span>
                    </p>
                    {Object.keys(players).length > 0 && (
                        <button className="start-button" onClick={startGame}>Start Game</button>
                    )}
                </div>
                <img src={qrcode} alt="Game Scene" className="qr-code" />
            </div>
        </div>
    );
}

export default Pregame;