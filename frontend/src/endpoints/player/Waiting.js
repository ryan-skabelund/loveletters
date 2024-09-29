import React from 'react';
import { useGameState } from "../../state/GameState";
import { UserPlusIcon, HeartIcon, CheckCircleIcon } from "lucide-react";
import './Player.css';

function Waiting() {

    const { name, is_in_game, setName, pending_join, setPendingJoin, sendToServer } = useGameState();

    return (
        <div className="players-container">
            <div className="players-card">
                <div className="players-header">
                    <HeartIcon className="heart-icon-left" />
                    <h1 className="players-title">Letter sent!</h1>
                    <HeartIcon className="heart-icon-right" />
                </div>
                <p>Waiting on other players...</p>
                
            </div>
        </div>
    );
}

export default Waiting;
