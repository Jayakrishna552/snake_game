import { useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import ScoreBoard from './ScoreBoard';
import { GRID_SIZE } from '../utils/gameUtils';

const SWIPE_THRESHOLD = 24;

export default function Game({
  gameState,
  status,
  level,
  highScore,
  soundOn,
  boostActive,
  newHighActive,
  onTogglePause,
  onToggleSound,
  onRestart,
  onDirection,
}) {
  const touchStart = useRef(null);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) onDirection(dx > 0 ? 'right' : 'left');
    else onDirection(dy > 0 ? 'down' : 'up');
  };

  const cellSize = 100 / GRID_SIZE;

  return (
    <div className="game">
      <ScoreBoard
        score={gameState.score}
        highScore={highScore}
        level={level}
        soundOn={soundOn}
        status={status}
        onTogglePause={onTogglePause}
        onToggleSound={onToggleSound}
        onRestart={onRestart}
      />

      <div className="board-area">
        <div
          className="board"
          style={{ backgroundSize: `${cellSize}% ${cellSize}%` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={(e) => e.preventDefault()}
        >
          <Food food={gameState.food} />
          <Snake snake={gameState.snake} />

          {boostActive && (
            <div className="boost-badge">⚡ SPEED BOOST</div>
          )}

          {newHighActive && (
            <div className="new-high-badge">NEW HIGH SCORE! 🏆</div>
          )}

          {status === 'paused' && (
            <div className="overlay">
              <div className="overlay-text">GAME PAUSED</div>
              <button type="button" className="btn-primary btn-lg" onClick={onTogglePause}>
                Resume
              </button>
            </div>
          )}
        </div>

        <div className="dpad" aria-label="Touch controls">
          <button
            type="button"
            className="dpad-btn dpad-up"
            onPointerDown={() => onDirection('up')}
            aria-label="Move up"
          >
            ▲
          </button>
          <button
            type="button"
            className="dpad-btn dpad-left"
            onPointerDown={() => onDirection('left')}
            aria-label="Move left"
          >
            ◀
          </button>
          <button
            type="button"
            className="dpad-btn dpad-right"
            onPointerDown={() => onDirection('right')}
            aria-label="Move right"
          >
            ▶
          </button>
          <button
            type="button"
            className="dpad-btn dpad-down"
            onPointerDown={() => onDirection('down')}
            aria-label="Move down"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}