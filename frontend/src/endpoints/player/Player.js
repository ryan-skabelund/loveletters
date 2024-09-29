import React from 'react';
import { useGameState } from "../../state/GameState";
import { UserPlusIcon, HeartIcon, CheckCircleIcon } from "lucide-react";
import './Player.css';

import JoinGame from './JoinGame';
import Gameplay from './Gameplay';
import Waiting from './Waiting';
import Watching from './Watching';

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

function Player() {

    const { game_phase, round_phase, is_in_game, submitted, sendToServer } = useGameState();

    if (is_in_game !== true) {
        return <JoinGame />;
    }

    switch (game_phase) {
        case GAME_PHASE.PRE_GAME:
          return <JoinGame />;
        case GAME_PHASE.IN_GAME:
            switch (round_phase){
              case ROUND_PHASE.PLAY:
                if (submitted === true) {
                    return <Waiting/>;
                }
                return <Gameplay/>

              case ROUND_PHASE.WATCH:
                return <Watching />

            }
        case GAME_PHASE.RESULTS:
          break;
        default:
          break;
    }

}

export default Player;
