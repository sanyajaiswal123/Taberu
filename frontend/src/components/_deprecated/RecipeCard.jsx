/**
 * @deprecated
 * Superseded by RecipeImageCard.jsx (supports real image URLs + lazy loading).
 * Kept for reference. Do not import or use.
 */

/**
 * RecipeCard Component — Level 2
 * Displays a single recipe with gradient header, emoji, ratings,
 * difficulty badge, favorite button, and key details.
 *
 * Props:
 *   recipe (object) - Recipe data object
 *   onClick (function) - Opens details modal
 */

import FavoriteButton from '../FavoriteButton';
import RatingStars from '../RatingStars';
import DifficultyBadge from '../DifficultyBadge';

function RecipeCard({ recipe, onClick }) {
  const visibleIngredients = recipe.ingredients.slice(0, 3);
  const extraCount = recipe.ingredients.length - 3;

  return (
    <div
      onClick={() => onClick(recipe)}
      className="group bg-cream-light rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-blush/60"
      id={`recipe-card-${recipe.id}`}
    >
      {/* Gradient Header with Emoji */}
      <div className={`bg-gradient-to-br ${recipe.gradient} h-40 flex items-center justify-center relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute top-3 right-3 w-20 h-20 rounded-full bg-white/10"></div>
        <div className="absolute bottom-3 left-3 w-14 h-14 rounded-full bg-white/10"></div>

        {/* Emoji */}
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
          {recipe.emoji}
        </span>

        {/* Type badge (top-left) */}
        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 shadow-sm">
          {recipe.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
        </span>

        {/* Favorite button (top-right) */}
        <div className="absolute top-3 right-3">
          <FavoriteButton recipeId={recipe.id} size="sm" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-deep mb-1.5 group-hover:text-terra transition-colors">
          {recipe.title}
        </h3>

        {/* Rating Stars */}
        {recipe.rating && (
          <div className="mb-2">
            <RatingStars rating={recipe.rating} reviewCount={recipe.reviewCount} compact />
          </div>
        )}

        {/* Meta row: cook time, servings, difficulty */}
        <div className="flex items-center gap-3 mb-3 text-xs text-deep-muted">
          <span className="flex items-center gap-1">⏱️ {recipe.cookTime}</span>
          <span className="flex items-center gap-1">👥 {recipe.servings}</span>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>

        {/* Ingredient tags */}
        <div className="flex flex-wrap gap-1.5">
          {visibleIngredients.map((ingredient, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-blush-light text-rosewood-800 rounded-md border border-blush">
              {ingredient}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs px-2 py-1 bg-rosewood-50 text-terra rounded-md font-medium border border-rosewood-100">
              +{extraCount} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
