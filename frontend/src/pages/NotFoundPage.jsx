import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-blush/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative z-10 text-center max-w-md"
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 20, delay: 0.05 }}
          className="font-display-lg text-blush mb-md block leading-none"
        >
          404
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-label-md text-terra-dark uppercase tracking-widest mb-sm"
        >
          Page Not Found
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 280, damping: 26 }}
          className="font-headline-lg text-deep mb-sm"
        >
          This dish isn't on the menu.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-body-md text-deep-muted leading-relaxed mb-lg"
        >
          The page you're looking for doesn't exist or has been moved.
          Head back and explore our recipes instead.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.36, type: 'spring', stiffness: 320, damping: 26 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to={isAuthenticated ? '/home' : '/'}
            className="inline-block px-md py-sm bg-terra-dark text-on-primary font-label-lg rounded-lg hover-lift transition-colors"
          >
            {isAuthenticated ? 'Back to App' : 'Back to Home'}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
