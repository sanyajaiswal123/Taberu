import { motion } from 'framer-motion';
import { spring } from '../lib/motion';

function EmptyState({
  icon = 'restaurant',
  title = 'No recipes found',
  message = 'Try different ingredients or fewer filters. We have lots of delicious recipes waiting for you!',
  actionLabel,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-20 px-4"
      id="empty-state"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="relative mb-md"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-blush/40 blur-xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="relative w-28 h-28 bg-blush-light rounded-full flex items-center justify-center border border-blush"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span
            className="material-symbols-outlined text-[64px] text-blush"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-headline-md text-deep mb-xs text-center"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-body-sm text-deep-muted text-center max-w-md leading-relaxed mb-lg"
      >
        {message}
      </motion.p>

      {actionLabel && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          className="px-md py-xs bg-terra-dark text-on-primary font-label-lg rounded-lg hover-lift cursor-pointer"
          id="empty-state-action"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}

export default EmptyState;
