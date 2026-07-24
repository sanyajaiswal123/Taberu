/**
 * @deprecated
 * Replaced by CountryFilter.jsx inside MultiFilter.jsx.
 * Kept for reference. Do not import or use.
 */

/**
 * CountryCategories Component
 * Grid of country cuisine cards (Japanese, Indian, Italian, etc.).
 * Clicking a card filters recipes by that country's cuisine.
 *
 * Props:
 *   onCuisineSelect (function) - Callback with cuisine ID
 */

import { countryCuisines } from '../data/mockCategories';

function CountryCategories({ onCuisineSelect }) {
  return (
    <section className="py-12 px-4 bg-cream-dark/30" id="country-categories">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep mb-2">
            🌍 Explore World Cuisines
          </h2>
          <p className="text-deep-muted text-sm">
            Travel the world through flavors
          </p>
        </div>

        {/* Cuisine Grid — 2 cols mobile, 3 cols tablet, 6 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {countryCuisines.map((cuisine) => (
            <div
              key={cuisine.id}
              onClick={() => onCuisineSelect(cuisine.id)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 aspect-[3/4]"
              id={`cuisine-${cuisine.id}`}
            >
              {/* Background Image */}
              <img
                src={cuisine.image}
                alt={`${cuisine.name} cuisine`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <span className="text-2xl mb-1 block">{cuisine.flagEmoji}</span>
                <h3 className="text-white font-display font-bold text-sm sm:text-base">
                  {cuisine.name}
                </h3>
                <p className="text-white/60 text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                  {cuisine.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CountryCategories;
