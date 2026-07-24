import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
} from '../services/api';

const CollectionsContext = createContext();

export function CollectionsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(() => {
    if (!isAuthenticated) { setCollections([]); return; }
    setLoading(true);
    getCollections()
      .then(setCollections)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => { reload(); }, [reload]);

  const addCollection = async ({ name, emoji }) => {
    const col = await createCollection({ name, emoji });
    setCollections((prev) => [...prev, col]);
    return col;
  };

  const renameCollection = async (id, patch) => {
    const updated = await updateCollection(id, patch);
    setCollections((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const removeCollection = async (id) => {
    await deleteCollection(id);
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const addToCollection = async (collectionId, recipeId) => {
    await addRecipeToCollection(collectionId, recipeId);
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId ? { ...c, recipes_count: (c.recipes_count ?? 0) + 1 } : c
      )
    );
  };

  const removeFromCollection = async (collectionId, recipeId) => {
    await removeRecipeFromCollection(collectionId, recipeId);
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, recipes_count: Math.max(0, (c.recipes_count ?? 1) - 1) }
          : c
      )
    );
  };

  return (
    <CollectionsContext.Provider value={{
      collections,
      loading,
      reload,
      addCollection,
      renameCollection,
      removeCollection,
      addToCollection,
      removeFromCollection,
    }}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error('useCollections must be used within a CollectionsProvider');
  return ctx;
}

export default CollectionsContext;
