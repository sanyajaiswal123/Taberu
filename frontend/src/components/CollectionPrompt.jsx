import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useCollections } from '../context/CollectionsContext';

function CollectionPrompt() {
  const { pendingCollectionRecipeId, clearPendingCollection } = useFavorites();
  const { collections, addToCollection } = useCollections();

  useEffect(() => {
    if (!pendingCollectionRecipeId) return;
    const t = setTimeout(clearPendingCollection, 6000);
    return () => clearTimeout(t);
  }, [pendingCollectionRecipeId, clearPendingCollection]);

  const handleAdd = async (collectionId) => {
    try {
      await addToCollection(collectionId, pendingCollectionRecipeId);
    } catch {
      // silent
    }
    clearPendingCollection();
  };

  return (
    <AnimatePresence>
      {pendingCollectionRecipeId && collections.length > 0 && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="fixed bottom-0 inset-x-0 bg-surface border-t border-blush rounded-t-2xl p-md shadow-xl z-[60]"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-headline-md text-deep">Add to collection?</span>
              <motion.button
                onClick={clearPendingCollection}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="text-deep-muted hover:text-deep transition-colors cursor-pointer"
                aria-label="Dismiss"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-xs">
              {collections.map((col, i) => (
                <motion.button
                  key={col.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 360, damping: 24 }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAdd(col.id)}
                  className="flex items-center gap-1 px-sm py-xs bg-cream-light border border-blush hover:border-terra-dark rounded-full font-label-md text-deep transition-colors cursor-pointer"
                >
                  {col.emoji && <span>{col.emoji}</span>}
                  {col.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CollectionPrompt;
