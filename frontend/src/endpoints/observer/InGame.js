import React from 'react';
import { useGameState } from '../../state/GameState';
import RoundPhasePlay from './RoundPhasePlay';

const ROUND_PHASE = {
    PLAY: 0,
    WATCH: 1,
    VOTE: 2,
    RESULTS: 3
};

function voteFor(username){

}

function InGame() {
    const { round_phase, prompt_prefix, prompt, players } = useGameState();
    switch (round_phase ) {
        case ROUND_PHASE.PLAY:
            return <RoundPhasePlay />;

        case ROUND_PHASE.WATCH:
            return(
                <div>
                    <p>
                        Watch the screen
                    </p>
                </div>
            );
            break;
        
        case ROUND_PHASE.VOTE:
            return(
                <div>
                    {Object.keys(players).map(username => (
                        <button key={username} onClick={() => voteFor(username)}>
                            {players[username].response}
                        </button>
                    ))}
                </div>
            );

        default:
            break;
    }
}

export default InGame;