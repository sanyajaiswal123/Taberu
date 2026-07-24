import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function LandingNavbar() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const anchorLinks = ['home', 'menu', 'about'];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.1 }}
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-rosewood-700 shadow-sm border-b border-blush/20'
          : 'bg-rosewood-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="inline-block font-body-lg font-bold tracking-wider text-on-primary uppercase hover:text-on-primary/80 transition-colors"
            >
              TABERU
            </motion.span>
          </Link>

          {/* Anchor links */}
          <div className="hidden md:flex gap-8">
            {anchorLinks.map((section) => (
              <motion.a
                key={section}
                href={`#${section}`}
                whileHover={{ y: -1.5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="font-label-lg text-on-primary/80 hover:text-on-primary transition-all duration-300 capitalize"
              >
                {section}
              </motion.a>
            ))}
          </div>

          {/* Auth CTAs */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.04, y: -1.5 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/home"
                  className="font-label-lg bg-terra-dark text-on-primary px-5 py-2 rounded-lg hover:bg-primary transition-colors"
                >
                  Go to App
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block font-label-lg text-on-primary/80 hover:text-on-primary transition-colors"
                >
                  Log in
                </Link>
                <motion.div whileHover={{ scale: 1.04, y: -1.5 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup"
                    className="font-label-lg bg-terra-dark text-on-primary px-5 py-2 rounded-lg hover:bg-primary transition-colors"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default LandingNavbar;
