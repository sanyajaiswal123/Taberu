import React from 'react';

const diets = [
  { id: 'veg', label: 'Vegetarian', icon: '🌱' },
  { id: 'non-veg', label: 'Non-Vegetarian', icon: '🍗' },
];

function DietFilter({ selectedDiets, onChange }) {
  const toggleDiet = (dietId) => {
    if (selectedDiets.includes(dietId)) {
      onChange(selectedDiets.filter((id) => id !== dietId));
    } else {
      onChange([...selectedDiets, dietId]);
    }
  };

  return (
    <div>
      <h3 className="font-label-md text-deep-muted uppercase tracking-wider mb-sm">Diet Type</h3>
      <div className="flex flex-wrap gap-2">
        {diets.map((diet) => {
          const isSelected = selectedDiets.includes(diet.id);
          return (
            <button
              key={diet.id}
              onClick={() => toggleDiet(diet.id)}
              aria-pressed={isSelected}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-terra-dark text-on-primary'
                  : 'bg-cream-light border border-blush text-deep hover:bg-blush-light'
              }`}
            >
              <span aria-hidden="true">{diet.icon}</span>
              {diet.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DietFilter;
