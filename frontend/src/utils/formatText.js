export function toTitleCase(value) {
  if (value === null || value === undefined) return '';

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\b[\p{L}\p{N}]/gu, (char) => char.toUpperCase());
}

export function ingredientName(ingredient) {
  if (typeof ingredient === 'string') return toTitleCase(ingredient);

  const qty = ingredient?.quantity ? `${ingredient.quantity} ` : '';
  return `${qty}${toTitleCase(ingredient?.name ?? '')}`.trim();
}
