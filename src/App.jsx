// src/App.js
import './App.css'; // Global styles
import Board from './components/Board.jsx'; // Main game board component

function App() {
  return (
    <div className="game-container">
      <header>
        <h1>Minesweeper</h1>
      </header>
      <main>
        <Board />
      </main>
      <footer>
        {/* <p>Built with React - Enjoy the game!</p> */}
      </footer>
    </div>
  );
}

export default App;
