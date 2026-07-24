import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

function FavoriteButton({ recipeId, size = 'md' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(recipeId);
  const [burst, setBurst] = useState(0);

  const sizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-xl',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!favorited) setBurst((b) => b + 1);
    toggleFavorite(recipeId);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className={`${sizes[size]} relative flex items-center justify-center rounded-full cursor-pointer ${
        favorited
          ? 'bg-gradient-to-br from-rosewood-500 to-terra text-white shadow-lg shadow-terra/40'
          : 'bg-white/90 text-deep-muted hover:text-terra backdrop-blur-md shadow-md'
      }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      id={`fav-btn-${recipeId}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={favorited ? 'on' : 'off'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: favorited ? [1, 1.35, 0.95, 1.15, 1] : 1,
            rotate: 0,
          }}
          exit={{ scale: 0, rotate: 180 }}
          transition={favorited
            ? { duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1] }
            : { type: 'spring', stiffness: 400, damping: 18 }}
        >
          {favorited ? '❤️' : '🤍'}
        </motion.span>
      </AnimatePresence>

      {/* Particle burst on activate */}
      <AnimatePresence>
        {burst > 0 && favorited && (
          <motion.div
            key={burst}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-terra"
                  initial={{ x: -3, y: -3, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * 24 - 3,
                    y: Math.sin(angle) * 24 - 3,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default FavoriteButton;
