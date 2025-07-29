// src/components/Board.js
import { useState, useEffect, useCallback } from 'react';
import Cell from './Cell.jsx';
import GameStatus from './GameStatus.jsx';
import { createBoard, revealCells, getNeighbors } from '../utils/minesweeperUtils.jsx';

// Define game parameters
const ROWS = 10; // e.g., 10 for beginner
const COLS = 10; // e.g., 10 for beginner
const NUM_MINES = 15; // e.g., 10-15 for beginner

const Board = () => {
  const [board, setBoard] = useState(() => createBoard(ROWS, COLS, NUM_MINES));
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [mineCount, setMineCount] = useState(NUM_MINES);
  const [isGameActive, setIsGameActive] = useState(true); // For timer

  const resetGame = useCallback(() => {
    setBoard(createBoard(ROWS, COLS, NUM_MINES));
    setGameStatus('playing');
    setMineCount(NUM_MINES);
    setIsGameActive(true);
  }, []);

  useEffect(() => {
    // Check for win condition whenever the board changes
    if (gameStatus !== 'playing') return;

    let revealedNonMineCount = 0;
    let flaggedMineCount = 0;
    let correctFlags = 0;
    let totalNonMines = ROWS * COLS - NUM_MINES;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c].isRevealed && !board[r][c].isMine) {
          revealedNonMineCount++;
        }
        if (board[r][c].isFlagged && board[r][c].isMine) {
          correctFlags++;
        }
        if (board[r][c].isFlagged) {
            flaggedMineCount++;
        }
      }
    }
    // Update mine count based on flags
    setMineCount(NUM_MINES - flaggedMineCount);


    // Win condition: all non-mine cells are revealed
    if (revealedNonMineCount === totalNonMines) {
      setGameStatus('won');
      setIsGameActive(false);
      // Auto-flag remaining mines on win (optional)
      const newBoard = board.map(row => row.map(cell => ({
          ...cell,
          isFlagged: cell.isMine ? true : cell.isFlagged
      })));
      setBoard(newBoard);
      setMineCount(0);
    }
  }, [board, gameStatus]);


  const handleCellClick = (r, c) => {
    if (gameStatus !== 'playing' || board[r][c].isFlagged || board[r][c].isRevealed) {
      return;
    }

    let newBoard = board.map(row => row.map(cell => ({ ...cell }))); // Create a new copy

    if (newBoard[r][c].isMine) {
      // Game Over - reveal all mines
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(newBoard);
      setGameStatus('lost');
      setIsGameActive(false);
      return;
    }

    newBoard = revealCells(newBoard, r, c, ROWS, COLS);
    setBoard(newBoard);
  };

  const handleCellContextMenu = (r, c) => {
    if (gameStatus !== 'playing' || board[r][c].isRevealed) {
      return;
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[r][c];
    cell.isFlagged = !cell.isFlagged;

    // Update mine count based on flags
    // This will be re-calculated in useEffect, but can be done here for immediate UI feedback if preferred
    // let currentFlaggedCount = 0;
    // newBoard.forEach(row => row.forEach(c => { if (c.isFlagged) currentFlaggedCount++; }));
    // setMineCount(NUM_MINES - currentFlaggedCount);

    setBoard(newBoard);
  };

  const boardStyle = {
    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
  };

  return (
    <div>
      <GameStatus
        mineCount={mineCount}
        gameStatus={gameStatus}
        onReset={resetGame}
        isGameActive={isGameActive}
      />
      <div className="board" style={boardStyle}>
        {board.map((row, rowIndex) =>
          row.map((cellData) => (
            <Cell
              key={`${cellData.r}-${cellData.c}`}
              data={cellData}
              onClick={handleCellClick}
              onContextMenu={handleCellContextMenu}
            />
          ))
        )}
      </div>
      {gameStatus === 'lost' && <div className="game-over-message">💣 Game Over! Try Again? 💣</div>}
      {gameStatus === 'won' && <div className="win-message">🎉 You Cleared The Field! 🎉</div>}
    </div>
  );
};

export default Board;
