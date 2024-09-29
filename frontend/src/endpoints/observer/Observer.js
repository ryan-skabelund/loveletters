import React from 'react';
import Pregame from './Pregame';
import InGame from './InGame';
import Watch from './Watch';
// import Results from './Results';
import { useGameState } from '../../state/GameState';

const GAME_PHASE = {
  PRE_GAME: 0,
  IN_GAME: 1,
  RESULTS: 2,
};

const ROUND_PHASE = {
  PLAY: 0,
  WATCH: 1,
  VOTE: 2,
  RESULTS: 3
};

function Observer() {

  const { game_phase, round_phase, is_in_game, submitted, sendToServer } = useGameState();

  switch (game_phase) {
      case GAME_PHASE.PRE_GAME:
        return <Pregame />;
      case GAME_PHASE.IN_GAME:

        switch (round_phase){
          case ROUND_PHASE.PLAY:
            return <InGame/>;

          case ROUND_PHASE.WATCH:
            return <Watch />;
          default:
            break;
        }

      case GAME_PHASE.RESULTS:
        // return <Results />;
      default:
        break;
  }

}

export default Observer;
