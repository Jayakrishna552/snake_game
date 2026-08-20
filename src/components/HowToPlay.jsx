export default function HowToPlay({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">How to Play</h2>
        <ul className="howto-list">
          <li>🍎 Eat food to grow longer and score points</li>
          <li>🥇 Golden food is worth <b>+30</b> points</li>
          <li>⚡ Speed food gives you a temporary speed boost</li>
          <li>🧱 Avoid the walls — hitting them ends the game</li>
          <li>🐍 Avoid your own body — don't bite your tail</li>
          <li>⌨️ Move with <b>Arrow keys</b> or <b>WASD</b></li>
          <li>⏸ Press <b>P</b> to pause or resume</li>
          <li>📱 On mobile, swipe on the board or use the D-pad</li>
        </ul>
        <button type="button" className="btn-primary btn-lg" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
}