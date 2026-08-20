import { GRID_SIZE } from '../utils/gameUtils';

export default function Food({ food }) {
  if (!food) return null;
  const size = 100 / GRID_SIZE;
  const pulse = food.type === 'golden' ? ' food-pulse-golden' : food.type === 'speed' ? ' food-pulse-speed' : ' food-pulse';
  return (
    <div
      className={`food${pulse}`}
      style={{
        left: `${food.x * size}%`,
        top: `${food.y * size}%`,
        width: `${size}%`,
        height: `${size}%`,
      }}
    >
      <span>{food.label}</span>
    </div>
  );
}