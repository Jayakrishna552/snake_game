let audioCtx = null;

function getContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq, duration, type = 'square', volume = 0.07, when = 0) {
  const ctx = getContext();
  if (!ctx) return;
  const start = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playEatSound(enabled, freq = 660) {
  if (!enabled) return;
  beep(freq, 0.08);
  beep(freq * 1.5, 0.12, 'square', 0.05, 0.05);
}

export function playGoldenSound(enabled) {
  if (!enabled) return;
  beep(880, 0.1);
  beep(1100, 0.12, 'square', 0.05, 0.08);
  beep(1320, 0.16, 'square', 0.05, 0.16);
}

export function playBoostSound(enabled) {
  if (!enabled) return;
  beep(200, 0.28, 'sawtooth', 0.06);
  beep(420, 0.34, 'sawtooth', 0.05, 0.06);
}

export function playGameOverSound(enabled) {
  if (!enabled) return;
  beep(320, 0.2);
  beep(240, 0.2, 'square', 0.07, 0.18);
  beep(160, 0.45, 'square', 0.07, 0.36);
}