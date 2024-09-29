import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import Socket from './Socket';

const StateContext = createContext(null);

export const useGameState = () => useContext(StateContext);

export const GameStateProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        players: {},
        max_players: 6,
        prompt: "",
        game_phase: 0,
        round_phase: 0,
        current_round: 0,
        round_end_time: "",
        viewing_username: ""
    });
    const [name, setName] = useState("");
    const [is_in_game, setInGame] = useState(false);
    const [pending_join, setPendingJoin] = useState(false);

    const [submitted, setSubmitted] = useState([]);

    const [availableWords, setAvailableWords] = useState([]);
    const [placedWords, setPlacedWords] = useState([]);
    const [draggingWord, setDraggingWord] = useState(null);
    const [draggingPosition, setDraggingPosition] = useState({ x: 0, y: 0 });
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const [voted, setVoted] = useState(false);

    // Initialize socket using useRef to persist across renders
    const socketRef = useRef();

    // Initialize the socket only once
    useEffect(() => {
        socketRef.current = new Socket("https://e87a-149-169-48-244.ngrok-free.app");

        socketRef.current.on("game_state", (data) => {
            updateGameState(data);
        });

        socketRef.current.on("joined", (data) => {
            setInGame(true);
            setPendingJoin(false);
        });

        socketRef.current.on("failed_to_join", (data) => {
            console.log("Failed to join");
            alert("Failed to join");
            setPendingJoin(false);
        });

        socketRef.current.on("refresh", (data) => {
            window.location.reload()
        });

        return () => socketRef.current.disconnect();
    }, []);

    const sendToServer = (event, data) => {
        socketRef.current.emit(event, data);
    };

    const updateGameState = (data) => {
        try {
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            setGameState(prevState => ({ ...prevState, ...parsedData }));
        } catch (error) {
            console.error("Failed to parse incoming data:", error);
        }
    };

    useEffect(() => {
        console.log("Updated gameState: ", gameState);
    }, [gameState]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        ...gameState,
        name,
        setName,
        is_in_game,
        setInGame,
        pending_join,
        setPendingJoin,
        voted,
        setVoted,
        sendToServer,
        submitted,
        setSubmitted,
        availableWords,
        setAvailableWords,
        placedWords,
        setPlacedWords,
        draggingWord,
        setDraggingWord,
        draggingPosition,
        setDraggingPosition,
        confirmSubmit,
        setConfirmSubmit,
    }), [
        gameState,
        name,
        is_in_game,
        pending_join,
        voted,
        submitted,
        availableWords,
        placedWords,
        draggingWord,
        draggingPosition,
        confirmSubmit,
    ]);

    return (
        <StateContext.Provider value={contextValue}>
            {children}
        </StateContext.Provider>
    );
};

export default GameStateProvider;
