// src/components/Cell.js
import { memo } from 'react';

/**
 * Cell Component
 * Represents a single cell in the Minesweeper grid.
 *
 * @param {object} props - Component props.
 * @param {object} props.data - The cell object data.
 * @param {function} props.onClick - Handler for left-click.
 * @param {function} props.onContextMenu - Handler for right-click (flagging).
 */
const Cell = ({ data, onClick, onContextMenu }) => {
  const handleClick = () => {
    if (!data.isRevealed && !data.isFlagged) {
      onClick(data.r, data.c);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent browser context menu
    if (!data.isRevealed) { // Can only flag/unflag unrevealed cells
      onContextMenu(data.r, data.c);
    }
  };

  let content = '';
  const cellClasses = ['cell'];

  if (data.isFlagged) {
    content = '🚩'; // Flag emoji
    cellClasses.push('flagged');
  } else if (data.isRevealed) {
    cellClasses.push('revealed');
    if (data.isMine) {
      content = '💣'; // Mine emoji
      cellClasses.push('mine');
    } else if (data.adjacentMines > 0) {
      content = data.adjacentMines;
      cellClasses.push(`n${data.adjacentMines}`); // Class for number styling e.g., n1, n2
    }
    // If adjacentMines is 0, content remains empty (blank revealed cell)
  }
  // If not flagged and not revealed, content remains empty (hidden cell)

  return (
    <div
      className={cellClasses.join(' ')}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      role="button"
      aria-pressed={data.isRevealed}
      aria-label={
        data.isFlagged ? "Flagged cell" :
        data.isRevealed ? (data.isMine ? "Mine" : `Cell with ${data.adjacentMines} adjacent mines`) :
        "Hidden cell"
      }
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => { // Allow actions with Enter/Space for left click, 'f' for flag
          if (e.key === 'Enter' || e.key === ' ') handleClick();
          if (e.key === 'f' || e.key === 'F') handleContextMenu(e);
      }}
    >
      {content}
    </div>
  );
};

// Memoize Cell to prevent unnecessary re-renders if its props haven't changed
export default memo(Cell);
