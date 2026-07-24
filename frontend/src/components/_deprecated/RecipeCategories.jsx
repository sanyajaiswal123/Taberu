/**
 * @deprecated
 * Replaced by CategoryFilter.jsx inside MultiFilter.jsx.
 * Kept for reference. Do not import or use.
 */

/**
 * RecipeCategories Component
 * Grid of recipe category cards (Breakfast, Dinner, Snacks, Dessert).
 * Clicking a card filters recipes by that category.
 *
 * Props:
 *   onCategorySelect (function) - Callback with category ID
 */

import { recipeCategories } from '../data/mockCategories';

function RecipeCategories({ onCategorySelect }) {
  return (
    <section className="py-12 px-4" id="recipe-categories">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep mb-2">
            🍱 Browse by Category
          </h2>
          <p className="text-deep-muted text-sm">
            Explore recipes for every meal of the day
          </p>
        </div>

        {/* Category Grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recipeCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 aspect-[4/3]"
              id={`category-${cat.id}`}
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-2xl mb-1 block">{cat.emoji}</span>
                <h3 className="text-white font-display font-bold text-lg">
                  {cat.name}
                </h3>
                <p className="text-white/70 text-xs mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecipeCategories;
