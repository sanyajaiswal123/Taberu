import { motion } from 'framer-motion';
import { toTitleCase } from '../utils/formatText';

function DifficultyBadge({ difficulty }) {
  const label = toTitleCase(difficulty);
  const styles = {
    Easy:   { bg: 'bg-sage/20',              text: 'text-tertiary',  ring: 'ring-sage/30',     dot: 'bg-sage' },
    Medium: { bg: 'bg-gold/20',              text: 'text-secondary', ring: 'ring-gold/30',     dot: 'bg-gold' },
    Hard:   { bg: 'bg-error-container/40',   text: 'text-error',     ring: 'ring-error/20',    dot: 'bg-error' },
  };

  const s = styles[label] || styles.Easy;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-md ${s.bg} ${s.text} ring-1 ${s.ring}`}
      id={`difficulty-${label.toLowerCase()}`}
    >
      <motion.span
        className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
        animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {label}
    </motion.span>
  );
}

export default DifficultyBadge;
