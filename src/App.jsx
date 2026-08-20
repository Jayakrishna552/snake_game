import { useState } from 'react';
import useSnakeGame from './hooks/useSnakeGame';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import GameOver from './components/GameOver';
import HowToPlay from './components/HowToPlay';

export default function App() {
  const game = useSnakeGame();
  const [showHowTo, setShowHowTo] = useState(false);

  const inGame = game.status === 'playing' || game.status === 'paused';

  return (
    <div className="app">
      <div className="scanlines" />

      {game.status === 'menu' && (
        <MainMenu
          highScore={game.highScore}
          onStart={game.startGame}
          onHowTo={() => setShowHowTo(true)}
        />
      )}

      {inGame && (
        <Game
          gameState={game.gameState}
          status={game.status}
          level={game.level}
          highScore={game.highScore}
          soundOn={game.soundOn}
          boostActive={game.boostActive}
          newHighActive={game.newHighActive}
          onTogglePause={game.togglePause}
          onToggleSound={game.toggleSound}
          onRestart={game.startGame}
          onDirection={game.setDirection}
        />
      )}

      {game.status === 'gameover' && (
        <GameOver
          score={game.gameState.score}
          highScore={game.highScore}
          isNewHighScore={game.isNewHighScore}
          onPlayAgain={game.startGame}
          onMenu={game.returnToMenu}
        />
      )}

      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
    </div>
  );
}