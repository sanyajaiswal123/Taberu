import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addFavorite, removeFavorite, getFavorites } from '../services/api';
import Toast from '../components/Toast';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  // After a successful add, stores the recipeId so CollectionPrompt can render
  const [pendingCollectionRecipeId, setPendingCollectionRecipeId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }
    getFavorites()
      .then((recipes) => setFavoriteIds(new Set(recipes.map((r) => r.id))))
      .catch(() => {});
  }, [isAuthenticated]);

  const isFavorite = (id) => favoriteIds.has(id);

  const toggleFavorite = async (id) => {
    if (!isAuthenticated) {
      setToast('Log in to save recipes');
      return;
    }

    const wasFavorited = favoriteIds.has(id);

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorited) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (wasFavorited) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
        // Signal that a collection assignment popup may show
        setPendingCollectionRecipeId(id);
      }
    } catch {
      // Revert on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteIds,
      favoritesCount: favoriteIds.size,
      isFavorite,
      toggleFavorite,
      pendingCollectionRecipeId,
      clearPendingCollection: () => setPendingCollectionRecipeId(null),
    }}>
      {children}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}

export default FavoritesContext;
