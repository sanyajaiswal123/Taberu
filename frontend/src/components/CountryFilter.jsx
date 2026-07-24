import React from 'react';

const cuisines = [
  { id: 'japanese', label: 'Japanese', icon: '🍱' },
  { id: 'indian', label: 'Indian', icon: '🍛' },
  { id: 'italian', label: 'Italian', icon: '🍕' },
  { id: 'chinese', label: 'Chinese', icon: '🥢' },
  { id: 'korean', label: 'Korean', icon: '🍲' },
  { id: 'mexican', label: 'Mexican', icon: '🌮' },
];

function CountryFilter({ selectedCuisines, onChange }) {
  const toggleCuisine = (cuisineId) => {
    if (selectedCuisines.includes(cuisineId)) {
      onChange(selectedCuisines.filter((id) => id !== cuisineId));
    } else {
      onChange([...selectedCuisines, cuisineId]);
    }
  };

  return (
    <div>
      <h3 className="font-label-md text-deep-muted uppercase tracking-wider mb-sm">Cuisine</h3>
      <div className="flex flex-wrap gap-2">
        {cuisines.map((cuisine) => {
          const isSelected = selectedCuisines.includes(cuisine.id);
          return (
            <button
              key={cuisine.id}
              onClick={() => toggleCuisine(cuisine.id)}
              aria-pressed={isSelected}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-terra-dark text-on-primary'
                  : 'bg-cream-light border border-blush text-deep hover:bg-blush-light'
              }`}
            >
              <span aria-hidden="true">{cuisine.icon}</span>
              {cuisine.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CountryFilter;
