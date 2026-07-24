import { motion } from 'framer-motion';
import { useMemo } from 'react';

const EMOJIS = ['🍅', '🥑', '🌿', '🍋', '🧄', '🌶️', '🥕', '🫛', '🍓', '🥖', '🥩', '🍯', '🍜', '🥗', '🍱', '🫐'];

function seededRand(n, seed = 1) {
  const x = Math.sin(n * 9301 + seed * 49297 + 233) * 10000;
  return x - Math.floor(x);
}

function makeItems(count, seed) {
  const cols = 4;
  const rows = 4;

  // Build all grid cells, assign a shuffle key, then pick `count` of them
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ row: r, col: c, order: seededRand(r * cols + c + 1, seed) });
    }
  }
  cells.sort((a, b) => a.order - b.order);
  const selected = cells.slice(0, count);

  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const pad = 0.18; // stay away from cell edges so emojis don't cluster at borders

  return selected.map((cell, i) => ({
    emoji:    EMOJIS[i % EMOJIS.length],
    left:     `${(cell.col + pad + seededRand(i * 3 + 100, seed) * (1 - 2 * pad)) * cellW}%`,
    top:      `${(cell.row + pad + seededRand(i * 7 + 200, seed) * (1 - 2 * pad)) * cellH}%`,
    size:     2.0 + seededRand(i * 11 + 300, seed) * 2.2,
    duration: 22 + seededRand(i * 13 + 400, seed) * 14,   // 22–36 s full cycle
    delay:    seededRand(i * 17 + 500, seed) * 18,          // staggered start 0–18 s
    yDrift:   12 + seededRand(i * 5  + 600, seed) * 18,    // 12–30 px vertical drift
    xDrift:   6  + seededRand(i * 23 + 700, seed) * 10,    // 6–16 px horizontal drift
  }));
}

export default function FloatingAmbient({ count = 14, seed = 1 }) {
  const items = useMemo(() => makeItems(count, seed), [count, seed]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {items.map((b, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            top: b.top,
            fontSize: `${b.size}rem`,
            userSelect: 'none',
            willChange: 'transform, opacity',
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            // opacity: fade in slowly → hold → fade out slowly
            opacity: [0, 0, 0.24, 0.24, 0.24, 0],
            // subtle drift up and back
            y:       [0, 0, -b.yDrift, -b.yDrift * 0.5, -b.yDrift * 0.8, 0],
            x:       [0, 0,  b.xDrift, -b.xDrift * 0.4,  b.xDrift * 0.2, 0],
            rotate:  [0, 0,  7,        -4,                 3,              0],
          }}
          transition={{
            // times: [start | begin-fade-in | fully-visible | mid-hold | near-end | fade-out-done]
            times:    [0, 0.08, 0.22, 0.55, 0.82, 1],
            duration: b.duration,
            delay:    b.delay,
            ease:     'easeInOut',
            repeat:   Infinity,
            repeatDelay: 4,   // 4 s gap between cycles so each emoji "breathes"
          }}
        >
          {b.emoji}
        </motion.span>
      ))}
    </div>
  );
}
