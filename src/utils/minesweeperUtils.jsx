// src/utils/minesweeperUtils.js

/**
 * Creates an initial Minesweeper board.
 * @param {number} rows - Number of rows.
 * @param {number} cols - Number of columns.
 * @param {number} numMines - Number of mines to place.
 * @returns {Array<Array<Object>>} - The initialized board.
 */
export const createBoard = (rows, cols, numMines) => {
  // 1. Initialize an empty board with cell objects
  let board = [];
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        r, // row
        c, // col
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0, // Number of mines in surrounding cells
      };
    }
  }

  // 2. Randomly place mines
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  // 3. Calculate adjacentMines for each cell
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        let mineCount = 0;
        getNeighbors(r, c, rows, cols).forEach(([nr, nc]) => {
          if (board[nr][nc].isMine) {
            mineCount++;
          }
        });
        board[r][c].adjacentMines = mineCount;
      }
    }
  }
  return board;
};

/**
 * Gets valid neighbors for a cell.
 * @param {number} r - Row of the cell.
 * @param {number} c - Column of the cell.
 * @param {number} rows - Total rows in the board.
 * @param {number} cols - Total columns in the board.
 * @returns {Array<Array<number>>} - Array of [row, col] for neighbors.
 */
export const getNeighbors = (r, c, rows, cols) => {
  const neighbors = [];
  // Check all 8 directions
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // Skip the cell itself
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }
  return neighbors;
};

/**
 * Reveals cells recursively (flood fill).
 * @param {Array<Array<Object>>} board - The current board state.
 * @param {number} r - Row of the clicked cell.
 * @param {number} c - Column of the clicked cell.
 * @param {number} rows - Total rows.
 * @param {number} cols - Total columns.
 * @returns {Array<Array<Object>>} - The new board state.
 */
export const revealCells = (board, r, c, rows, cols) => {
  let newBoard = board.map(row => row.map(cell => ({ ...cell }))); // Deep copy

  const cell = newBoard[r][c];

  if (cell.isRevealed || cell.isFlagged) {
    return newBoard; // Don't reveal already revealed or flagged cells
  }

  cell.isRevealed = true;

  // If the revealed cell is a '0' (no adjacent mines), reveal its neighbors
  if (cell.adjacentMines === 0 && !cell.isMine) {
    getNeighbors(r, c, rows, cols).forEach(([nr, nc]) => {
      if (!newBoard[nr][nc].isRevealed) { // Only recurse if neighbor not already revealed
        newBoard = revealCells(newBoard, nr, nc, rows, cols);
      }
    });
  }
  return newBoard;
};
