import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 26, delay: i * 0.07 },
  }),
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="p-sm bg-error-container/40 border border-error/20 text-error font-body-sm rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="block font-label-lg text-deep mb-1.5" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          className="w-full bg-cream-light border border-blush rounded-xl px-sm py-3 font-body-md text-deep focus:border-terra-dark focus:ring-1 focus:ring-terra-dark outline-none transition-all placeholder:text-deep-muted/50"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </motion.div>

      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="block font-label-lg text-deep mb-1.5" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          className="w-full bg-cream-light border border-blush rounded-xl px-sm py-3 font-body-md text-deep focus:border-terra-dark focus:ring-1 focus:ring-terra-dark outline-none transition-all placeholder:text-deep-muted/50"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </motion.div>

      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isLoading ? { scale: 0.97 } : {}}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="w-full py-3 bg-primary text-on-primary font-label-lg rounded-xl hover-lift transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            'Sign In'
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default LoginForm;
