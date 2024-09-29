import { useGameState } from '../../state/GameState';
import './InGame.css'

function RoundPhasePlay() {
    const { prompt_prefix, prompt } = useGameState();

    return (
        <div class="love-letter-container">
            <div class="love-letter-card">
                <p class="p-class">{prompt_prefix}</p>
            </div>
            <div class="love-letter-card prompt-card">
                <p class="p-class"><strong>{prompt}</strong></p>
            </div>
        </div>
    );
}

export default RoundPhasePlay;