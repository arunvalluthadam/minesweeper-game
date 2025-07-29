// src/components/GameStatus.js
import { useState, useEffect, memo } from 'react';

/**
 * GameStatus Component
 * Displays game information like mine count, timer, and reset button.
 *
 * @param {object} props - Component props.
 * @param {number} props.mineCount - Number of mines remaining to be flagged.
 * @param {string} props.gameStatus - Current status of the game ('playing', 'won', 'lost').
 * @param {function} props.onReset - Function to reset the game.
 * @param {boolean} props.isGameActive - True if the game is currently active (not won or lost).
 */
const GameStatus = ({ mineCount, gameStatus, onReset, isGameActive }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timerId;
    if (isGameActive && gameStatus === 'playing') {
      timerId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerId);
      if (gameStatus !== 'playing') { // Reset timer if game ends or is reset externally
          // Time is preserved if gameStatus is 'won' or 'lost' until reset
      }
    }
    // Cleanup timer on component unmount or when game becomes inactive
    return () => clearInterval(timerId);
  }, [isGameActive, gameStatus]);

  // Reset timer when game is reset via the button
  const handleResetClick = () => {
    setTime(0); // Reset timer locally
    onReset();   // Call parent's reset logic
  };

  const getFaceEmoji = () => {
    if (gameStatus === 'won') return '😎'; // Sunglass face for win
    if (gameStatus === 'lost') return '😵'; // Dizzy face for loss
    return '🙂'; // Smiley face for playing
  };

  return (
    <div className="game-status">
      <div className="mine-count" aria-label={`Mines remaining: ${mineCount}`}>
        💣 {String(mineCount).padStart(3, '0')}
      </div>
      <button
        className="reset-button status-face"
        onClick={handleResetClick}
        aria-label="Reset game"
      >
        {getFaceEmoji()}
      </button>
      <div className="timer" aria-label={`Time elapsed: ${time} seconds`}>
        ⏱️ {String(time).padStart(3, '0')}
      </div>
    </div>
  );
};

export default memo(GameStatus);
