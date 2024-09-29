import React from 'react';
import { useGameState } from "../../state/GameState";
import { UserPlusIcon, HeartIcon, CheckCircleIcon } from "lucide-react";
import './Player.css';

function JoinGame() {

    const { name, is_in_game, setName, pending_join, setPendingJoin, sendToServer } = useGameState();

    const joinGame = () => {
        if (name) {
            setPendingJoin(true);
            sendToServer("join_game", { player_name: name });
        }
    };

    return (
        <div className="players-container">
            <div className="players-card">
                <div className="players-header">
                    <HeartIcon className="heart-icon-left" />
                    <h1 className="players-title">Love Letters</h1>
                    <HeartIcon className="heart-icon-right" />
                </div>
                <div className="join-game">
                    <div className="input-group">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="name-input"
                            aria-label="Your name"
                            disabled={pending_join || is_in_game}
                        />
                    </div>
                    <button onClick={joinGame} disabled={pending_join || is_in_game} className="join-button">
                        <UserPlusIcon className="join-icon" />
                        Join Game
                    </button>
                    {is_in_game && (
                        <div className="success-message" role="alert">
                        <CheckCircleIcon className="success-icon" />
                        Game joined, waiting for start...
                        </div>
                    )}
                    {!is_in_game && (
                        <div className="error-message" role="alert">
                        Please enter your name to join the game.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JoinGame;
