import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GRID_SIZE,
  INITIAL_DIRECTION,
  INITIAL_SNAKE,
  DIRECTION_VECTORS,
  isOpposite,
  randomFood,
  getDelayForLevel,
  getLevelFromFoodsEaten,
} from '../utils/gameUtils';
import {
  playEatSound,
  playGoldenSound,
  playBoostSound,
  playGameOverSound,
} from '../utils/sound';

const HIGH_SCORE_KEY = 'snakeArenaHighScore';
const BOOST_DURATION = 5000;

function readHighScore() {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    const value = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function createInitialState() {
  return {
    snake: INITIAL_SNAKE.map((c) => ({ ...c })),
    food: null,
    direction: INITIAL_DIRECTION,
    score: 0,
    foodsEaten: 0,
  };
}

export default function useSnakeGame() {
  const [status, setStatus] = useState('menu');
  const [gameState, setGameState] = useState(createInitialState);
  const [highScore, setHighScore] = useState(readHighScore);
  const [soundOn, setSoundOn] = useState(true);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [boostActive, setBoostActive] = useState(false);

  const statusRef = useRef(status);
  const gameRef = useRef(gameState);
  const soundRef = useRef(soundOn);
  const boostRef = useRef(boostActive);
  const nextDirectionRef = useRef(null);
  const highScoreRef = useRef(highScore);
  const sessionStartHighRef = useRef(highScore);
  const boostTimerRef = useRef(null);

  statusRef.current = status;
  soundRef.current = soundOn;
  boostRef.current = boostActive;
  highScoreRef.current = highScore;

  const clearBoostTimer = useCallback(() => {
    if (boostTimerRef.current) {
      clearTimeout(boostTimerRef.current);
      boostTimerRef.current = null;
    }
    boostRef.current = false;
    setBoostActive(false);
  }, []);

  const finishGame = useCallback(() => {
    const finalScore = gameRef.current.score;
    const sessionHigh = sessionStartHighRef.current;
    const isNew = finalScore > sessionHigh && finalScore > 0;
    setIsNewHighScore(isNew);
    if (isNew) {
      setHighScore(finalScore);
      highScoreRef.current = finalScore;
      localStorage.setItem(HIGH_SCORE_KEY, String(finalScore));
    }
    clearBoostTimer();
    playGameOverSound(soundRef.current);
    setStatus('gameover');
  }, [clearBoostTimer]);

  const activateBoost = useCallback(() => {
    playBoostSound(soundRef.current);
    if (boostTimerRef.current) clearTimeout(boostTimerRef.current);
    boostRef.current = true;
    setBoostActive(true);
    boostTimerRef.current = setTimeout(() => {
      boostRef.current = false;
      setBoostActive(false);
      boostTimerRef.current = null;
    }, BOOST_DURATION);
  }, []);

  const step = useCallback(() => {
    const state = gameRef.current;
    let { snake, food, direction, score, foodsEaten } = state;

    if (nextDirectionRef.current && !isOpposite(nextDirectionRef.current, direction)) {
      direction = nextDirectionRef.current;
    }
    nextDirectionRef.current = null;

    const head = snake[0];
    const vector = DIRECTION_VECTORS[direction];
    const newHead = { x: head.x + vector.x, y: head.y + vector.y };

    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID_SIZE || newHead.y >= GRID_SIZE) {
      finishGame();
      return;
    }

    const eating = food !== null && food.x === newHead.x && food.y === newHead.y;
    const bodyToCheck = eating ? snake : snake.slice(0, -1);
    if (bodyToCheck.some((c) => c.x === newHead.x && c.y === newHead.y)) {
      finishGame();
      return;
    }

    const newSnake = eating ? [newHead, ...snake] : [newHead, ...snake.slice(0, -1)];

    let newFood = food;
    let newScore = score;
    let newFoodsEaten = foodsEaten;

    if (eating) {
      newScore = score + food.points;
      newFoodsEaten = foodsEaten + 1;
      newFood = randomFood(newSnake);
      if (food.type === 'golden') {
        playGoldenSound(soundRef.current);
      } else if (food.type === 'speed') {
        activateBoost();
      } else {
        playEatSound(soundRef.current);
      }
    }

    const next = {
      snake: newSnake,
      food: newFood,
      direction,
      score: newScore,
      foodsEaten: newFoodsEaten,
    };
    gameRef.current = next;
    setGameState(next);

    if (newScore > highScoreRef.current) {
      setHighScore(newScore);
      highScoreRef.current = newScore;
      localStorage.setItem(HIGH_SCORE_KEY, String(newScore));
    }
  }, [activateBoost, finishGame]);

  const stepRef = useRef(step);
  stepRef.current = step;

  const startGame = useCallback(() => {
    clearBoostTimer();
    const initial = {
      ...createInitialState(),
      food: randomFood(INITIAL_SNAKE),
    };
    gameRef.current = initial;
    nextDirectionRef.current = null;
    sessionStartHighRef.current = highScoreRef.current;
    setIsNewHighScore(false);
    setGameState(initial);
    setStatus('playing');
  }, [clearBoostTimer]);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'playing') setStatus('paused');
    else if (statusRef.current === 'paused') setStatus('playing');
  }, []);

  const returnToMenu = useCallback(() => {
    clearBoostTimer();
    gameRef.current = createInitialState();
    setGameState(gameRef.current);
    setIsNewHighScore(false);
    setStatus('menu');
  }, [clearBoostTimer]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const setDirection = useCallback((dir) => {
    if (statusRef.current !== 'playing') return;
    if (isOpposite(dir, gameRef.current.direction)) return;
    nextDirectionRef.current = dir;
  }, []);

  const level = getLevelFromFoodsEaten(gameState.foodsEaten);
  const newHighActive = (status === 'playing' || status === 'paused') && gameState.score > sessionStartHighRef.current && gameState.score > 0;

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const delay = getDelayForLevel(level, boostActive);
    const id = setInterval(() => stepRef.current(), delay);
    return () => clearInterval(id);
  }, [status, level, boostActive]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const dirMap = {
        ArrowUp: 'up', w: 'up', W: 'up',
        ArrowDown: 'down', s: 'down', S: 'down',
        ArrowLeft: 'left', a: 'left', A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right',
      };
      if (dirMap[key]) {
        e.preventDefault();
        setDirection(dirMap[key]);
      } else if (key === 'p' || key === 'P') {
        togglePause();
      } else if (key === ' ' && statusRef.current === 'gameover') {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection, togglePause, startGame]);

  return {
    status,
    gameState,
    level,
    highScore,
    soundOn,
    boostActive,
    isNewHighScore,
    newHighActive,
    startGame,
    togglePause,
    toggleSound,
    setDirection,
    returnToMenu,
  };
}