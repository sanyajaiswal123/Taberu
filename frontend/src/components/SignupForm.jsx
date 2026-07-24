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
    transition: { type: 'spring', stiffness: 320, damping: 26, delay: i * 0.06 },
  }),
};

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const user = await authService.signup(name, email, password);
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { custom: 0, id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', value: name, onChange: (e) => setName(e.target.value) },
    { custom: 1, id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', value: email, onChange: (e) => setEmail(e.target.value) },
    { custom: 2, id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', value: password, onChange: (e) => setPassword(e.target.value) },
    { custom: 3, id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
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

      {fields.map((f) => (
        <motion.div
          key={f.id}
          custom={f.custom}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label className="block font-label-lg text-deep mb-1.5" htmlFor={f.id}>
            {f.label}
          </label>
          <input
            id={f.id}
            type={f.type}
            required
            className="w-full bg-cream-light border border-blush rounded-xl px-sm py-3 font-body-md text-deep focus:border-terra-dark focus:ring-1 focus:ring-terra-dark outline-none transition-all placeholder:text-deep-muted/50"
            placeholder={f.placeholder}
            value={f.value}
            onChange={f.onChange}
          />
        </motion.div>
      ))}

      <motion.div
        custom={fields.length}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
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
            'Create Account'
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default SignupForm;
