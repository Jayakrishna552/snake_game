export default function GameOver({ score, highScore, isNewHighScore, onPlayAgain, onMenu }) {
  return (
    <div className="overlay gameover-overlay">
      <div className="panel">
        <h2 className="gameover-title">GAME OVER</h2>
        {isNewHighScore && <div className="new-high">NEW HIGH SCORE! 🏆</div>}
        <div className="final-score">
          <span className="stat-label">Final Score</span>
          <span className="final-value stat-green">{score}</span>
        </div>
        <div className="final-score">
          <span className="stat-label">High Score</span>
          <span className="final-value stat-pink">{highScore}</span>
        </div>
        <div className="btn-row">
          <button type="button" className="btn-primary btn-lg" onClick={onPlayAgain}>
            Play Again
          </button>
          <button type="button" className="btn-secondary btn-lg" onClick={onMenu}>
            Main Menu
          </button>
        </div>
        <div className="menu-hint">Press Space to play again</div>
      </div>
    </div>
  );
}