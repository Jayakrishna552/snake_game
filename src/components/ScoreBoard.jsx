export default function ScoreBoard({
  score,
  highScore,
  level,
  soundOn,
  status,
  onTogglePause,
  onToggleSound,
  onRestart,
}) {
  return (
    <div className="scoreboard">
      <div className="stat">
        <span className="stat-label">Score</span>
        <span className="stat-value stat-green">{score}</span>
      </div>
      <div className="stat">
        <span className="stat-label">High</span>
        <span className="stat-value stat-pink">{highScore}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Level</span>
        <span className="stat-value stat-blue">{level}</span>
      </div>
      <div className="controls">
        <button
          type="button"
          className="btn-icon"
          aria-label={status === 'paused' ? 'Resume' : 'Pause'}
          onClick={onTogglePause}
        >
          {status === 'paused' ? '▶' : '⏸'}
        </button>
        <button
          type="button"
          className="btn-icon"
          aria-label={soundOn ? 'Mute' : 'Unmute'}
          onClick={onToggleSound}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
        <button type="button" className="btn-icon" aria-label="Restart" onClick={onRestart}>
          ↻
        </button>
      </div>
    </div>
  );
}