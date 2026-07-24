/**
 * Helper to determine if a recipe is vegetarian based on keywords in its title and ingredients.
 *
 * @param {Object} recipe
 * @returns {boolean} True if the recipe is vegetarian, false otherwise.
 */
export function isVegetarian(recipe) {
  if (!recipe) return true;

  const nonVegKeywords = [
    'chicken', 'beef', 'pork', 'bacon', 'salmon', 'shrimp', 'fish', 'prawn',
    'crab', 'lobster', 'squid', 'octopus', 'anchovy', 'clam', 'mussel',
    'oyster', 'seafood', 'turkey', 'lamb', 'mutton', 'ham', 'sausage',
    'pepperoni', 'meat', 'tuna', 'steak', 'gelatin', 'lard', 'bologna', 'salami'
  ];

  // Check title
  const titleLower = (recipe.title || '').toLowerCase();
  if (nonVegKeywords.some(keyword => titleLower.includes(keyword))) {
    return false;
  }

  // Check ingredients
  const ingredients = recipe.ingredients || [];
  for (const ing of ingredients) {
    const name = (typeof ing === 'string' ? ing : ing.name || '').toLowerCase();
    if (nonVegKeywords.some(keyword => name.includes(keyword))) {
      return false;
    }
  }

  return true;
}
