import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import FavoriteButton from './FavoriteButton';
import DifficultyBadge from './DifficultyBadge';
import { toTitleCase } from '../utils/formatText';

function RecipeImageCard({ recipe, onClick }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!recipe.image && !imgError;

  return (
    <motion.div
      onClick={() => onClick(recipe)}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="w-full bg-surface rounded-2xl border border-blush overflow-hidden hover-lift flex flex-col group cursor-pointer h-full"
      style={{ willChange: 'transform' }}
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden bg-surface-container-low">
        {hasImage ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${recipe.gradient || 'from-blush to-terra'} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
          >
            <span className="text-6xl drop-shadow-md">{recipe.emoji || '🍽️'}</span>
          </div>
        )}

        {/* Favorite button */}
        <div
          className="absolute top-sm right-sm z-10 w-8 h-8 rounded-full bg-cream-light/80 backdrop-blur-sm border border-terra-dark/30 hover:bg-cream-light flex items-center justify-center transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <FavoriteButton recipeId={recipe.id} />
        </div>
      </div>

      {/* Content */}
      <div className="p-sm flex flex-col flex-grow">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {recipe.category && (
            <span className="bg-primary/10 text-primary font-label-md text-[10px] rounded-md px-2 py-1 uppercase tracking-wider">
              {toTitleCase(recipe.category)}
            </span>
          )}
          {recipe.cuisine && (
            <span className="bg-sage/20 text-tertiary-container font-label-md text-[10px] rounded-md px-2 py-1">
              {toTitleCase(recipe.cuisine)}
            </span>
          )}
          {recipe.difficulty && (
            <DifficultyBadge difficulty={recipe.difficulty} />
          )}
        </div>

        {/* Title */}
        <h3 className="font-body-lg font-bold text-deep group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
          {recipe.title}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="font-body-sm text-deep-muted line-clamp-2 mb-2">{recipe.description}</p>
        )}

        {recipe.rating > 0 && (
          <div className="mb-2">
            <RatingStars rating={recipe.rating || 0} reviewCount={recipe.reviewCount || 0} compact />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-blush/50 pt-sm mt-auto">
          <div className="flex items-center gap-1 font-body-sm text-deep-muted">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            <span>{recipe.cookTime || 'N/A'}</span>
          </div>
          {recipe.servings && (
            <div className="flex items-center gap-1 font-body-sm text-deep-muted">
              <span className="material-symbols-outlined text-[14px]">group</span>
              <span>{recipe.servings} serves</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default RecipeImageCard;
