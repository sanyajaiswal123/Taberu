import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryFilter from './CategoryFilter';
import CountryFilter from './CountryFilter';
import DietFilter from './DietFilter';

function MultiFilter({
  selectedCategories,
  onCategoryChange,
  selectedCuisines,
  onCuisineChange,
  selectedDiets,
  onDietChange
}) {
  const activeCount = selectedCategories.length + selectedCuisines.length + selectedDiets.length;
  const hasFilters = activeCount > 0;

  const clearFilters = () => {
    onCategoryChange([]);
    onCuisineChange([]);
    onDietChange([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="w-full bg-surface-container-low rounded-2xl border border-blush p-md mb-md"
      role="group"
      aria-label="Recipe filters"
    >
      <div className="flex justify-between items-center mb-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-deep-muted" aria-hidden="true">tune</span>
          <h2 className="font-headline-md text-deep">Filter Recipes</h2>
          <AnimatePresence>
            {hasFilters && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                className="inline-flex items-center justify-center w-6 h-6 bg-terra-dark text-white text-[10px] font-bold rounded-full"
                aria-label={`${activeCount} filter${activeCount !== 1 ? 's' : ''} active`}
              >
                {activeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="font-label-md text-deep-muted hover:text-terra-dark transition-colors underline underline-offset-2 cursor-pointer"
            aria-label={`Clear all ${activeCount} active filter${activeCount !== 1 ? 's' : ''}`}
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-md">
        <div className="flex-1">
          <CategoryFilter selectedCategories={selectedCategories} onChange={onCategoryChange} />
        </div>
        <div className="hidden lg:block w-px bg-blush/40" aria-hidden="true" />
        <div className="flex-1">
          <DietFilter selectedDiets={selectedDiets} onChange={onDietChange} />
        </div>
        <div className="hidden lg:block w-px bg-blush/40" aria-hidden="true" />
        <div className="flex-1">
          <CountryFilter selectedCuisines={selectedCuisines} onChange={onCuisineChange} />
        </div>
      </div>
    </motion.div>
  );
}

export default MultiFilter;
