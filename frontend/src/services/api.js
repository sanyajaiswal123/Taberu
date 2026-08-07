import api from './axiosInstance';

// ── Recipes ──────────────────────────────────────────────────────────────────

export const getAllRecipes = async (params = {}) => {
  const { data } = await api.get('/recipes', { params });
  return data.data ?? data;
};

export const getPopularRecipes = async (limit = 6) => {
  const { data } = await api.get('/recipes/popular', { params: { limit } });
  return data.data ?? data;
};

export const getRecipeById = async (id) => {
  const { data } = await api.get(`/recipes/${id}`);
  return data.data ?? data;
};

export const getIngredientSuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  const { data } = await api.get('/ingredients/suggestions', { params: { q: query } });
  return data;
};

export const incrementView = async (id) => {
  await api.post(`/recipes/${id}/view`).catch(() => {});
};

// ── Favorites ────────────────────────────────────────────────────────────────

export const getFavorites = async () => {
  const { data } = await api.get('/favorites');
  return data.data ?? data;
};

export const addFavorite = async (id) => {
  await api.post(`/favorites/${id}`);
};

export const removeFavorite = async (id) => {
  await api.delete(`/favorites/${id}`);
};

// ── Collections ──────────────────────────────────────────────────────────────

export const getCollections = async () => {
  const { data } = await api.get('/collections');
  return data;
};

export const createCollection = async ({ name, emoji }) => {
  const { data } = await api.post('/collections', { name, emoji });
  return data;
};

export const updateCollection = async (id, patch) => {
  const { data } = await api.put(`/collections/${id}`, patch);
  return data;
};

export const deleteCollection = async (id) => {
  await api.delete(`/collections/${id}`);
};

export const addRecipeToCollection = async (collectionId, recipeId) => {
  await api.post(`/collections/${collectionId}/recipes`, { recipe_id: recipeId });
};

export const removeRecipeFromCollection = async (collectionId, recipeId) => {
  await api.delete(`/collections/${collectionId}/recipes/${recipeId}`);
};

export const getCollectionRecipes = async (collectionId) => {
  const { data } = await api.get(`/collections/${collectionId}/recipes`);
  return data.data ?? data;
};

// ── Recipe Notes ─────────────────────────────────────────────────────────────

export const getRecipeNote = async (recipeId) => {
  const { data } = await api.get(`/recipes/${recipeId}/note`);
  return data;
};

export const upsertRecipeNote = async (recipeId, noteText) => {
  const { data } = await api.put(`/recipes/${recipeId}/note`, { note_text: noteText });
  return data;
};

export const deleteRecipeNote = async (recipeId) => {
  await api.delete(`/recipes/${recipeId}/note`);
};

// ── Cook Log ─────────────────────────────────────────────────────────────────

export const getCookLog = async (page = 1, perPage = 20) => {
  const { data } = await api.get('/cook-log', { params: { page, per_page: perPage } });
  return data;
};

export const logCook = async ({ recipeId, cookedAt, rating }) => {
  const { data } = await api.post('/cook-log', {
    recipe_id:  recipeId,
    cooked_at:  cookedAt ?? undefined,
    rating:     rating ?? undefined,
  });
  return data;
};

export const deleteCookLog = async (id) => {
  await api.delete(`/cook-log/${id}`);
};

export const getCookStats = async () => {
  const { data } = await api.get('/cook-log/stats');
  return data;
};

export const getCookCountForRecipe = async (recipeId) => {
  const { data } = await api.get(`/cook-log/recipe/${recipeId}`);
  return data;
};

// ── Meal Planner ─────────────────────────────────────────────────────────────

export const getMealPlan = async (weekStartDate) => {
  const { data } = await api.get('/meal-plan', { params: { week: weekStartDate } });
  return data;
};

export const addMealPlanItem = async ({ recipeId, weekStartDate, dayOfWeek, mealSlot }) => {
  const { data } = await api.post('/meal-plan/items', {
    recipe_id:       recipeId,
    week_start_date: weekStartDate,
    day_of_week:     dayOfWeek,
    meal_slot:       mealSlot,
  });
  return data;
};

export const removeMealPlanItem = async (itemId) => {
  await api.delete(`/meal-plan/items/${itemId}`);
};

export const moveMealPlanItem = async (itemId, { dayOfWeek, mealSlot }) => {
  const { data } = await api.put(`/meal-plan/items/${itemId}/move`, {
    day_of_week: dayOfWeek,
    meal_slot:   mealSlot,
  });
  return data;
};

export const getShoppingList = async (weekStartDate) => {
  const { data } = await api.get('/meal-plan/shopping-list', { params: { week: weekStartDate } });
  return data;
};

export const toggleShoppingCheck = async ({ ingredientName, isChecked, weekStartDate }) => {
  await api.patch('/meal-plan/shopping-list/check', {
    ingredient_name:  ingredientName,
    is_checked:       isChecked,
    week_start_date:  weekStartDate,
  });
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminGetRecipes = async ({ search = '', page = 1 } = {}) => {
  const { data } = await api.get('/admin/recipes', { params: { search, page } });
  return data;
};

export const adminCreateRecipe = async (payload) => {
  const { data } = await api.post('/admin/recipes', payload);
  return data;
};

export const adminUpdateRecipe = async (id, payload) => {
  const { data } = await api.put(`/admin/recipes/${id}`, payload);
  return data;
};

export const adminDeleteRecipe = async (id) => {
  await api.delete(`/admin/recipes/${id}`);
};

export const adminGetUsers = async ({ search = '', page = 1 } = {}) => {
  const { data } = await api.get('/admin/users', { params: { search, page } });
  return data;
};

export const adminUpdateUserRole = async (id, role) => {
  const { data } = await api.patch(`/admin/users/${id}/role`, { role });
  return data;
};

export const adminDeleteUser = async (id) => {
  await api.delete(`/admin/users/${id}`);
};

export const adminGetOverview = async () => {
  const { data } = await api.get('/admin/analytics/overview');
  return data;
};

export const adminGetSearchGaps = async () => {
  const { data } = await api.get('/admin/analytics/search-gaps');
  return data;
};

export const adminGetPopularRecipes = async (sort = 'views') => {
  const { data } = await api.get('/admin/analytics/popular-recipes', { params: { sort } });
  return data;
};

export const adminGetTrendingSearches = async (days = 7) => {
  const { data } = await api.get('/admin/analytics/trending-searches', { params: { days } });
  return data;
};

export const adminGetEngagement = async () => {
  const { data } = await api.get('/admin/analytics/engagement');
  return data;
};
