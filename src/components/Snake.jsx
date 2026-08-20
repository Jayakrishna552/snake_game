import { GRID_SIZE } from '../utils/gameUtils';

const ROTATION = {
  up: 0,
  right: 90,
  down: 180,
  left: -90,
};

export default function Snake({ snake }) {
  const size = 100 / GRID_SIZE;
  const len = snake.length;
  const head = snake[0];
  const neck = snake[1] ?? head;
  const tail = snake[len - 1];
  const beforeTail = snake[len - 2] ?? tail;

  const dx = head.x - neck.x;
  const dy = head.y - neck.y;
  const direction = dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'down' : 'up';
  const rotation = ROTATION[direction] ?? 0;

  const tdx = tail.x - beforeTail.x;
  const tdy = tail.y - beforeTail.y;
  const tailDirection = tdx === 1 ? 'right' : tdx === -1 ? 'left' : tdy === 1 ? 'down' : 'up';
  const tailRotation = ROTATION[tailDirection] ?? 0;

  return (
    <>
      {snake.map((segment, i) => {
        const isHead = i === 0;
        const isNeck = i === 1;
        const isTail = i === len - 1 && len > 1;
        return (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`snake-seg${isHead ? ' snake-head' : ''}${isNeck ? ' snake-neck' : ''}${
              isTail ? ' snake-tail' : ''
            }`}
            style={{
              left: `${segment.x * size}%`,
              top: `${segment.y * size}%`,
              width: `${size}%`,
              height: `${size}%`,
            }}
          >
            {isHead && (
              <div className="snake-face" style={{ transform: `rotate(${rotation}deg)` }}>
                <span className="snake-tongue" />
                <span className="snake-eye snake-eye-left" />
                <span className="snake-eye snake-eye-right" />
              </div>
            )}
            {isTail && (
              <span
                className="snake-tail-tip"
                style={{ transform: `rotate(${tailRotation}deg) scale(1.12)` }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}