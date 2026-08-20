export default function MainMenu({ highScore, onStart, onHowTo }) {
  return (
    <div className="menu">
      <h1 className="title">
        <span className="title-snake">SNAKE</span>
        <span className="title-arena">ARENA</span>
      </h1>
      <div className="menu-high">
        <span className="menu-high-label">HIGH SCORE</span>
        <span className="menu-high-value">{highScore}</span>
      </div>
      <div className="menu-buttons">
        <button type="button" className="btn-primary btn-lg" onClick={onStart}>
          ▶ Start Game
        </button>
        <button type="button" className="btn-secondary btn-lg" onClick={onHowTo}>
          How to Play
        </button>
      </div>
      <div className="menu-hint">Arrow keys / WASD to move · P to pause</div>
    </div>
  );
}