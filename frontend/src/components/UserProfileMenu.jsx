import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const go = (path) => { setIsOpen(false); navigate(path); };
  const handleLogout = () => { setIsOpen(false); logout(); navigate('/'); };

  if (!user) return null;

  const menuItems = [
    { icon: '👤', label: 'My Profile', path: '/profile' },
    { icon: '❤️', label: 'My Favorites', path: '/favorites' },
    { icon: '🗓️', label: 'Meal Planner', path: '/planner' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        className="flex items-center gap-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full border-2 border-gold-light/60 object-cover shadow-md"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-sage rounded-full border-2 border-rosewood-700"
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute right-0 mt-3 w-52 bg-white/96 backdrop-blur-md rounded-2xl shadow-2xl shadow-rosewood-900/15 border border-blush/40 py-2 z-50 origin-top-right"
          >
            <div className="px-4 py-2.5 border-b border-blush/30 mb-1">
              <p className="text-sm font-semibold text-deep truncate">{user.name}</p>
              <p className="text-xs text-deep-muted truncate">{user.email}</p>
            </div>

            {menuItems.map((item, i) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 360, damping: 26 }}
                onClick={() => go(item.path)}
                whileHover={{ x: 3 }}
                className="w-full text-left px-4 py-2.5 text-sm text-deep hover:bg-cream/70 transition-colors flex items-center gap-2.5 rounded-lg"
              >
                <span>{item.icon}</span> {item.label}
              </motion.button>
            ))}

            {isAdmin && (
              <>
                <div className="border-t border-blush/20 my-1" />
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.length * 0.04, type: 'spring', stiffness: 360, damping: 26 }}
                  onClick={() => go('/admin')}
                  whileHover={{ x: 3 }}
                  className="w-full text-left px-4 py-2.5 text-sm text-deep-muted hover:bg-cream/70 transition-colors flex items-center gap-2.5 rounded-lg"
                >
                  <span>⚙️</span> Admin Panel
                </motion.button>
              </>
            )}

            <div className="border-t border-blush/20 my-1" />
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: (menuItems.length + (isAdmin ? 1 : 0)) * 0.04,
                type: 'spring',
                stiffness: 360,
                damping: 26,
              }}
              onClick={handleLogout}
              whileHover={{ x: 3 }}
              className="w-full text-left px-4 py-2.5 text-sm text-rosewood-700 hover:bg-rosewood-50/80 transition-colors flex items-center gap-2.5 rounded-lg"
            >
              <span>👋</span> Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserProfileMenu;
