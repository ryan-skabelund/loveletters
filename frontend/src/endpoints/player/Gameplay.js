import React, { useEffect, useRef, useState } from 'react';
import { useGameState } from "../../state/GameState";
import './Gameplay.css';

import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';

function Gameplay() {
    const {
        players,
        name,
        submitted,
        setSubmitted,
        sendToServer,
        words,
        availableWords,
        setAvailableWords,
        placedWords,
        setPlacedWords,
        confirmSubmit,
        setConfirmSubmit,
    } = useGameState();
    
    const [activeId, setActiveId] = useState(null);
    const boardRef = useRef(null);
    
    // Initialize availableWords only once when words change
    useEffect(() => {
        if (availableWords.length === 0 && placedWords.length === 0 && players && players[name] && players[name].words && players[name].words.length > 0) {
            const initialAvailableWords = players[name].words.map((word, index) => ({
                id: `word-${index}`,
                word,
                rotation: Math.floor(Math.random() * 15) - 7,
                color: getRandomColor(),
                fontSize: getRandomFontSize(),
            }));
            setAvailableWords(initialAvailableWords);
        }
    }, [availableWords.length, setAvailableWords]);

    const submitResults = () => {
        setSubmitted(true);
        console.log("submit:", { player_name: name, words: placedWords });
        sendToServer("submit_response", placedWords);
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const word = availableWords.find(w => w.id === activeId) || placedWords.find(w => w.id === activeId);

        if (!word) {
            setActiveId(null);
            return;
        }

        if (overId === 'board') {
            // Dropped on board
            const boardRect = boardRef.current.getBoundingClientRect();
            const activeRect = event.active.rect.current.translated;

            const x = activeRect.left - boardRect.left;
            const y = activeRect.top - boardRect.top;

            if (availableWords.find(w => w.id === activeId)) {
                // Moving from availableWords to board
                setPlacedWords(prev => [...prev, { ...word, x, y }]);
                setAvailableWords(prev => prev.filter(w => w.id !== activeId));
            } else {
                // Moving within the board
                setPlacedWords(prev => prev.map(w => w.id === activeId ? { ...w, x, y } : w));
            }
        } else if (overId === 'word-container') {
            // Dropped on word container
            if (placedWords.find(w => w.id === activeId)) {
                // Remove from placedWords
                setPlacedWords(prev => prev.filter(w => w.id !== activeId));
                // Add back to availableWords if not already there
                if (!availableWords.find(w => w.id === activeId)) {
                    setAvailableWords(prev => [...prev, word]);
                }
            }
        }

        setActiveId(null);
    };
    
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="gameplay">
                <div className="content">
                    <DroppableBoard placedWords={placedWords} boardRef={boardRef} />
                    <WordContainer words={availableWords} />
                </div>
                {!confirmSubmit ? (
                    <button className="submit-button" onClick={() => setConfirmSubmit(true)}>Submit</button>
                ) : (
                    <div className="confirmation">
                        <p>Are you sure you want to submit?</p>
                        <button className="confirm-button" onClick={submitResults}>Yes</button>
                        <button className="cancel-button" onClick={() => setConfirmSubmit(false)}>No</button>
                    </div>
                )}
            </div>
            <DragOverlay>
                {activeId ? (
                    <DragOverlayWord id={activeId} words={[...availableWords, ...placedWords]} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
    
}

function DroppableBoard({ placedWords, boardRef }) {
    const { setNodeRef } = useDroppable({
        id: 'board',
    });

    return (
        <div
            id="board"
            ref={(node) => {
                setNodeRef(node);
                boardRef.current = node;
            }}
            className="board"
        >
            {placedWords.map((item) => (
                <DraggableWordInBoard key={item.id} word={item} />
            ))}
        </div>
    );
}

function WordContainer({ words }) {
    const { setNodeRef } = useDroppable({
        id: 'word-container',
    });

    return (
        <div className="word-container" ref={setNodeRef}>
            {words.map((wordObj) => (
                <DraggableWord key={wordObj.id} word={wordObj} />
            ))}
        </div>
    );
}

function DraggableWord({ word }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: word.id,
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${word.rotation}deg)`
            : `rotate(${word.rotation}deg)`,
        touchAction: 'none',
        cursor: 'grab',
        position: 'relative',
        color: word.color,
        fontSize: word.fontSize,
        userSelect: 'none',
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-word">
            {word.word}
        </div>
    );
}

function DraggableWordInBoard({ word }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: word.id,
    });

    const style = {
        position: 'absolute',
        left: word.x,
        top: word.y,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${word.rotation}deg)`
            : `rotate(${word.rotation}deg)`,
        touchAction: 'none',
        cursor: 'grab',
        color: word.color,
        fontSize: word.fontSize,
        userSelect: 'none',
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="placed-word">
            {word.word}
        </div>
    );
}

function DragOverlayWord({ id, words }) {
    const word = words.find(w => w.id === id);
    if (!word) return null;

    const style = {
        transform: `rotate(${word.rotation}deg)`,
        color: word.color,
        fontSize: word.fontSize,
        cursor: 'grabbing',
        userSelect: 'none',
    };

    return (
        <div style={style} className="dragging-word">
            {word.word}
        </div>
    );
}

function getRandomColor() {
    const colors = ['#000', '#333', '#666', '#999', '#cc0000', '#006600', '#000066'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomFontSize() {
    const sizes = ['14px', '16px', '18px', '20px'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

export default Gameplay;
