import { useState } from 'react';
import { motion } from 'framer-motion';
import FavoriteButton from './FavoriteButton';
import RatingStars from './RatingStars';
import { toTitleCase } from '../utils/formatText';

function TrendingCard({ recipe, onClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onClick(recipe)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(recipe)}
      aria-label={`View recipe: ${recipe.title}`}
      className="min-w-[280px] md:min-w-[340px] h-[400px] rounded-2xl overflow-hidden relative snap-start hover-lift group cursor-pointer border border-blush flex-shrink-0 focus-visible:outline-2 focus-visible:outline-terra-dark focus-visible:outline-offset-2"
      style={{ willChange: 'transform' }}
    >
      {/* Background image */}
      <div className="absolute inset-0 bg-surface-container">
        {recipe.image && !imgError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${recipe.gradient || 'from-blush to-terra'} flex items-center justify-center`}
          >
            <span className="text-6xl drop-shadow-md">{recipe.emoji || '🍽️'}</span>
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/40 to-transparent" />

      {/* Favorite button */}
      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-10 rounded-full bg-terra-dark/80 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <FavoriteButton recipeId={recipe.id} size="sm" />
        </div>
      </div>

      {/* Bottom text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-md z-10">
        {recipe.rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="material-symbols-outlined text-[16px] text-secondary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-label-md text-white/90">{recipe.rating.toFixed(1)}</span>
          </div>
        )}
        <h3 className="font-headline-md text-white mb-1 line-clamp-2">{recipe.title}</h3>
        <div className="flex items-center gap-2 font-body-sm text-white/80">
          {recipe.cuisine && <span>{toTitleCase(recipe.cuisine)}</span>}
          {recipe.cuisine && recipe.cookTime && <span>·</span>}
          {recipe.cookTime && <span>{recipe.cookTime}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default TrendingCard;
