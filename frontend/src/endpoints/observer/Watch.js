import React from 'react';
import { useGameState } from "../../state/GameState";
import './Watch.css';

function Watch({ words, boardWidth = 800, boardHeight = 600, originalBoardWidth = 800, originalBoardHeight = 600 }) {

    const { players, viewing_username } = useGameState();

    const scaleX = 1//boardWidth / originalBoardWidth;
    const scaleY = 1//boardHeight / originalBoardHeight;

    return (
        <div className="result-board" style={{ width: boardWidth, height: boardHeight }}>
            {players && viewing_username && players[viewing_username] !== null ? players[viewing_username].response.map(word => {
              console.log(word.x, word.y, word.x * scaleX, word.y * scaleY);
                return <div
                    key={word.id}
                    className="draggable-word"
                    style={{
                        position: 'absolute',
                        left: `${word.x * scaleX}px`,
                        top: `${word.y * scaleY}px`,
                        transform: `rotate(${word.rotation}deg)`,
                        color: word.color,
                        fontSize: word.fontSize,
                        userSelect: 'none',
                    }}
                >
                    {word.word}
                </div>
            }) : null}
        </div>
    );
}

export default Watch;

