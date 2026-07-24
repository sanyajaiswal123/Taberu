import React from 'react';

const categories = [
  { id: 'breakfast', label: 'Breakfast', icon: 'free_breakfast' },
  { id: 'dinner', label: 'Dinner', icon: 'dinner_dining' },
  { id: 'snacks', label: 'Snacks', icon: 'bakery_dining' },
  { id: 'dessert', label: 'Dessert', icon: 'cake' },
];

function CategoryFilter({ selectedCategories, onChange }) {
  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div>
      <h3 className="font-label-md text-deep-muted uppercase tracking-wider mb-sm">Food Type</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              aria-pressed={isSelected}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-terra-dark text-on-primary'
                  : 'bg-cream-light border border-blush text-deep hover:bg-blush-light'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilter;
