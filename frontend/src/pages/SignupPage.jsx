import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignupForm from '../components/SignupForm';

function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden md:flex w-1/2 bg-rosewood-700 flex-col items-center justify-center p-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blush/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blush/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.1 }}
          className="relative z-10 text-center"
        >
          <Link to="/">
            <h1 className="font-display-lg text-on-primary mb-md">TABERU</h1>
          </Link>
          <p className="font-headline-md text-on-primary/80 mt-md max-w-xs text-center">
            Join us and start your culinary journey today
          </p>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-margin-mobile md:p-xl bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="w-full max-w-md bg-surface rounded-2xl border border-blush shadow-[0_8px_30px_rgb(92,61,46,0.08)] p-lg flex flex-col gap-md my-8"
        >
          {/* Mobile logo */}
          <div className="md:hidden text-center">
            <Link to="/" className="inline-block">
              <span className="font-label-lg font-bold text-deep tracking-wider uppercase">TABERU</span>
            </Link>
          </div>

          <h2 className="font-headline-lg text-deep">Create Account</h2>

          <SignupForm />

          <p className="text-center font-label-lg text-deep-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-terra-dark hover:underline font-label-lg">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupPage;
