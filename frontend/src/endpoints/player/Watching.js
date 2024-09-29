import React from 'react';
import { useGameState } from "../../state/GameState";
import { HeartIcon } from "lucide-react";
import './Player.css';

function Watching() {
    return (
        <div className="players-container">
            <div className="players-card">
                <div className="players-header">
                    <HeartIcon className="heart-icon-left" />
                    <h1 className="players-title">Read the letters</h1>
                    <HeartIcon className="heart-icon-right" />
                </div>
                <p>Watch the screen...</p>
                
            </div>
        </div>
    );
}

export default Watching;
