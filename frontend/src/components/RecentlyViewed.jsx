import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RecipeImageCard from './RecipeImageCard';

const STORAGE_KEY = 'taberu_recently_viewed';

export function addToRecentlyViewed(recipe) {
  if (!recipe || !recipe.id) return;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter((r) => r.id !== recipe.id);
    const updated = [recipe, ...filtered].slice(0, 6);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function RecentlyViewed({ onRecipeClick }) {
  const [recentRecipes, setRecentRecipes] = useState([]);

  useEffect(() => {
    setRecentRecipes(getRecentlyViewed());
  }, []);

  if (recentRecipes.length === 0) return null;

  return (
    <section className="py-lg px-margin-mobile md:px-margin-desktop overflow-hidden max-w-[1440px] mx-auto" id="recently-viewed">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="font-headline-lg text-deep mb-md flex items-center gap-2"
        >
          <span
            className="material-symbols-outlined text-[28px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            history
          </span>
          Recently Viewed
        </motion.h2>

        <div className="flex gap-md overflow-x-auto pb-sm hide-scrollbar snap-x snap-mandatory">
          {recentRecipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 26 }}
              className="w-72 sm:w-80 flex-shrink-0 snap-start flex"
            >
              <RecipeImageCard recipe={recipe} onClick={onRecipeClick} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentlyViewed;

