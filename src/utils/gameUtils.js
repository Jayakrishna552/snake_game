export const GRID_SIZE = 20;

export const INITIAL_DIRECTION = 'right';

export const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export const FOOD_TYPES = [
  { type: 'normal', label: '🍎', points: 10, weight: 62 },
  { type: 'golden', label: '🥇', points: 30, weight: 23 },
  { type: 'speed', label: '⚡', points: 10, weight: 15 },
];

export function isOpposite(a, b) {
  return OPPOSITES[a] === b;
}

const createInitialSnake = () => {
  const c = Math.floor(GRID_SIZE / 2);
  return [
    { x: c, y: c },
    { x: c - 1, y: c },
    { x: c - 2, y: c },
  ];
};

export const INITIAL_SNAKE = createInitialSnake();

export function randomFood(snake) {
  const occupied = new Set(snake.map((cell) => `${cell.x},${cell.y}`));
  const free = [];
  for (let x = 0; x < GRID_SIZE; x += 1) {
    for (let y = 0; y < GRID_SIZE; y += 1) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;

  const cell = free[Math.floor(Math.random() * free.length)];
  const totalWeight = FOOD_TYPES.reduce((sum, f) => sum + f.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosen = FOOD_TYPES[0];
  for (const f of FOOD_TYPES) {
    roll -= f.weight;
    if (roll <= 0) {
      chosen = f;
      break;
    }
  }
  return { ...cell, type: chosen.type, label: chosen.label, points: chosen.points };
}

export function getDelayForLevel(level, boostActive) {
  const base = Math.max(55, 170 - (level - 1) * 12);
  return boostActive ? Math.max(40, Math.round(base * 0.55)) : base;
}

export function getLevelFromFoodsEaten(foodsEaten) {
  return Math.floor(foodsEaten / 5) + 1;
}