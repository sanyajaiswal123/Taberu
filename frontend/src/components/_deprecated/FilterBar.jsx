/**
 * @deprecated
 * Superseded by MultiFilter.jsx (CategoryFilter + CountryFilter combination).
 * Kept for reference. Do not import or use.
 */

/**
 * FilterBar Component
 * Filter recipes: All, Veg, or Non-Veg
 */

function FilterBar({ activeFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All Recipes', icon: '🍽️' },
    { value: 'veg', label: 'Vegetarian', icon: '🟢' },
    { value: 'non-veg', label: 'Non-Veg', icon: '🔴' },
    { value: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { value: 'snacks', label: 'Snacks', icon: '🥟' },
    { value: 'dessert', label: 'Dessert', icon: '🍰' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4" id="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
            activeFilter === filter.value
              ? 'bg-gradient-to-r from-rosewood-700 to-terra text-cream-light border-rosewood-700 shadow-lg shadow-rosewood-700/25'
              : 'bg-cream-light text-deep border-blush hover:border-terra hover:text-terra'
          }`}
          id={`filter-${filter.value}`}
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
