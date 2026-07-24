/**
 * Shared Framer Motion variants and constants.
 * Import individually to keep bundles small.
 */

export const spring = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

export const softSpring = {
  type: 'spring',
  stiffness: 180,
  damping: 22,
};

export const snappySpring = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
};

// ── Page-level transitions ────────────────────────────────────────────────
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ── Grids / lists ─────────────────────────────────────────────────────────
export const gridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export const gridItem = {
  hidden:  { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: spring },
};

// ── Cards (hover) ─────────────────────────────────────────────────────────
export const cardHover = {
  rest:  { y: 0, scale: 1, transition: spring },
  hover: { y: -6, scale: 1.015, transition: spring },
};

// ── Buttons ───────────────────────────────────────────────────────────────
export const buttonTap = {
  whileHover: { scale: 1.03 },
  whileTap:   { scale: 0.96 },
  transition: snappySpring,
};

// ── Modal ─────────────────────────────────────────────────────────────────
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { ...spring, stiffness: 300, damping: 26 } },
  exit:    { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.18 } },
};

// ── Toast / dropdown ──────────────────────────────────────────────────────
export const slideUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: spring },
  exit:    { opacity: 0, y: 16, transition: { duration: 0.18 } },
};

export const dropdown = {
  initial: { opacity: 0, scale: 0.95, y: -6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { ...spring, stiffness: 320, damping: 26 } },
  exit:    { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.15 } },
};

// ── Reveal on scroll viewport defaults ────────────────────────────────────
export const viewportOnce = { once: true, margin: '-80px' };

export const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
