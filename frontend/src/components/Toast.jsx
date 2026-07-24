import { useEffect } from 'react';
import { motion } from 'framer-motion';

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-md py-sm bg-inverse-surface text-inverse-on-surface font-body-sm rounded-xl shadow-xl flex items-center gap-sm whitespace-nowrap border border-on-surface/10"
    >
      <motion.span
        aria-hidden="true"
        animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
        transition={{ duration: 0.6 }}
        className="material-symbols-outlined text-[18px] text-inverse-on-surface/80"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        info
      </motion.span>
      <span>{message}</span>
    </motion.div>
  );
}

export default Toast;
