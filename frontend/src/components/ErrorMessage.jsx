import { motion } from 'framer-motion';

function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="flex flex-col items-center justify-center py-16 px-4"
      id="error-message"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.05 }}
        className="relative mb-md"
      >
        <div className="absolute inset-0 bg-blush rounded-full blur-2xl opacity-50" />
        <motion.div
          className="relative w-20 h-20 bg-blush-light rounded-full flex items-center justify-center border border-blush"
          animate={{ rotate: [-3, 3, -2, 2, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span
            className="material-symbols-outlined text-[40px] text-error"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            error
          </span>
        </motion.div>
      </motion.div>

      <h3 className="font-headline-md text-deep mb-xs">Oops! Something went wrong</h3>
      <p className="font-body-sm text-deep-muted text-center max-w-md mb-md">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="px-md py-xs bg-terra-dark text-on-primary font-label-lg rounded-lg hover-lift cursor-pointer"
          id="retry-button"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}

export default ErrorMessage;
