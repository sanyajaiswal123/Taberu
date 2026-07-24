import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useCollections } from '../context/CollectionsContext';
import { getFavorites, getCollectionRecipes } from '../services/api';
import RecipeImageCard from '../components/RecipeImageCard';
import RecipeDetails from '../components/RecipeDetails';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const EMOJI_OPTIONS = ['📁', '⭐', '🍜', '🥗', '🍰', '🥘', '🌮', '🍣', '🍕', '🥦'];

/**
 * Dropdown rendered via a portal at a fixed screen position.
 * This completely bypasses overflow clipping on any ancestor.
 */
function CollectionMenu({ col, anchorRect, onRename, onDelete, onClose }) {
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on scroll so the menu doesn't float away from its anchor
  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [onClose]);

  if (!anchorRect) return null;

  const style = {
    position: 'fixed',
    top: anchorRect.bottom + 6,
    right: window.innerWidth - anchorRect.right,
    zIndex: 9999,
  };

  return createPortal(
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={style}
      className="w-36 bg-surface rounded-xl shadow-xl border border-blush py-1 origin-top-right"
    >
      <button
        onClick={() => { onRename(col); onClose(); }}
        className="w-full text-left px-3 py-2 font-body-sm text-deep hover:bg-surface-container-low transition-colors"
      >
        ✏️ Rename
      </button>
      <button
        onClick={() => onDelete(col.id)}
        className="w-full text-left px-3 py-2 font-body-sm text-error hover:bg-error-container/20 transition-colors"
      >
        🗑️ Delete
      </button>
    </motion.div>,
    document.body
  );
}

function CollectionBar({ activeId, onSelect }) {
  const { collections, addCollection, renameCollection, removeCollection } = useCollections();
  const { favoritesCount } = useFavorites();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('📁');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState(null);
  const [renaming, setRenaming] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await addCollection({ name: newName.trim(), emoji: newEmoji });
    setNewName('');
    setNewEmoji('📁');
    setCreating(false);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!renaming?.name.trim()) return;
    await renameCollection(renaming.id, { name: renaming.name, emoji: renaming.emoji });
    setRenaming(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this collection? Recipes stay in your favorites.')) return;
    if (activeId === id) onSelect(null);
    await removeCollection(id);
    setMenuOpenId(null);
    setMenuAnchorRect(null);
  };

  const openMenu = (e, colId) => {
    if (menuOpenId === colId) {
      setMenuOpenId(null);
      setMenuAnchorRect(null);
    } else {
      // Capture the exact screen position of the ⋯ button
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuAnchorRect(rect);
      setMenuOpenId(colId);
    }
  };

  const closeMenu = useCallback(() => {
    setMenuOpenId(null);
    setMenuAnchorRect(null);
  }, []);

  const activeCol = collections.find((c) => c.id === menuOpenId) ?? null;

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
      {/* Pill row — overflow-x-auto is fine now; dropdowns escape via portal */}
      <div className="flex gap-sm overflow-x-auto hide-scrollbar pb-xs">

        {/* All Saved */}
        <button
          onClick={() => onSelect(null)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-md py-xs rounded-full font-label-md transition-colors cursor-pointer ${
            activeId === null
              ? 'bg-terra-dark text-on-primary'
              : 'bg-cream-light border border-blush text-deep hover:bg-blush-light'
          }`}
        >
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          All Saved
          {favoritesCount > 0 && (
            <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${activeId === null ? 'bg-on-primary/20 text-on-primary' : 'bg-blush text-deep'}`}>
              {favoritesCount}
            </span>
          )}
        </button>

        {/* User collections */}
        {collections.map((col) => (
          <div key={col.id} className="relative flex-shrink-0">
            <button
              onClick={() => onSelect(col.id)}
              className={`flex items-center gap-1.5 px-md py-xs rounded-full font-label-md transition-colors cursor-pointer ${
                activeId === col.id
                  ? 'bg-terra-dark text-on-primary'
                  : 'bg-cream-light border border-blush text-deep hover:bg-blush-light'
              }`}
            >
              {col.emoji && <span>{col.emoji}</span>}
              {col.name}
              {col.recipes_count > 0 && (
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${activeId === col.id ? 'bg-on-primary/20 text-on-primary' : 'bg-blush text-deep'}`}>
                  {col.recipes_count}
                </span>
              )}
            </button>
            {/* ⋯ button — measures its own position on click */}
            <button
              onClick={(e) => openMenu(e, col.id)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blush-light hover:bg-blush rounded-full text-xs flex items-center justify-center text-deep-muted cursor-pointer"
              aria-label="Collection options"
            >
              ⋯
            </button>
          </div>
        ))}

        {/* New Collection button */}
        <button
          onClick={() => setCreating(true)}
          className="flex-shrink-0 flex items-center gap-1.5 px-md py-xs rounded-full font-label-md border border-dashed border-deep-muted text-deep-muted hover:border-terra-dark hover:text-terra-dark transition-colors cursor-pointer"
        >
          + New Collection
        </button>
      </div>

      {/* Portal dropdown — lives in document.body, never clipped */}
      <AnimatePresence>
        {menuOpenId && activeCol && (
          <CollectionMenu
            key={menuOpenId}
            col={activeCol}
            anchorRect={menuAnchorRect}
            onRename={(col) => setRenaming({ id: col.id, name: col.name, emoji: col.emoji ?? '📁' })}
            onDelete={handleDelete}
            onClose={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Inline create form */}
      {creating && (
        <form onSubmit={handleCreate} className="mt-sm flex items-center gap-2 flex-wrap">
          <select
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="border border-blush rounded-lg px-2 py-1.5 font-body-sm bg-cream-light cursor-pointer"
          >
            {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Collection name"
            className="border border-blush rounded-lg px-sm py-1.5 font-body-sm focus:outline-none focus:border-terra-dark bg-cream-light"
            maxLength={100}
          />
          <button type="submit" className="px-sm py-1.5 bg-terra-dark text-on-primary font-label-md rounded-lg hover:bg-primary cursor-pointer">Create</button>
          <button type="button" onClick={() => setCreating(false)} className="px-sm py-1.5 font-label-md text-deep-muted hover:text-deep cursor-pointer">Cancel</button>
        </form>
      )}

      {/* Inline rename form */}
      {renaming && (
        <form onSubmit={handleRename} className="mt-sm flex items-center gap-2 flex-wrap">
          <select
            value={renaming.emoji}
            onChange={(e) => setRenaming((r) => ({ ...r, emoji: e.target.value }))}
            className="border border-blush rounded-lg px-2 py-1.5 font-body-sm bg-cream-light cursor-pointer"
          >
            {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <input
            autoFocus
            value={renaming.name}
            onChange={(e) => setRenaming((r) => ({ ...r, name: e.target.value }))}
            className="border border-blush rounded-lg px-sm py-1.5 font-body-sm focus:outline-none focus:border-terra-dark bg-cream-light"
            maxLength={100}
          />
          <button type="submit" className="px-sm py-1.5 bg-terra-dark text-on-primary font-label-md rounded-lg hover:bg-primary cursor-pointer">Save</button>
          <button type="button" onClick={() => setRenaming(null)} className="px-sm py-1.5 font-label-md text-deep-muted hover:text-deep cursor-pointer">Cancel</button>
        </form>
      )}
    </div>
  );
}

function FavoritesPage() {
  const { favoritesCount } = useFavorites();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const navigate = useNavigate();

  const loadRecipes = async (collectionId) => {
    setLoading(true);
    try {
      if (collectionId === null) {
        const data = await getFavorites();
        setRecipes(data);
      } else {
        const data = await getCollectionRecipes(collectionId);
        setRecipes(data);
      }
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecipes(activeCollectionId); }, [activeCollectionId]);

  const handleSelectCollection = (id) => {
    setActiveCollectionId(id);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
    loadRecipes(activeCollectionId);
  };

  return (
    <main className="flex-1 bg-background">

      {/* Page header */}
      <section className="bg-gradient-to-r from-blush-light via-cream-light to-blush-light border-b border-blush py-lg px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display-lg-mobile md:font-display-lg text-deep">
            Your Favorites
          </h1>
          <p className="font-body-md text-deep-muted mt-sm">
            {favoritesCount > 0
              ? `${favoritesCount} saved recipe${favoritesCount !== 1 ? 's' : ''}`
              : 'Save recipes you love and find them here'}
          </p>
        </div>
      </section>

      {/* Collections bar */}
      <CollectionBar activeId={activeCollectionId} onSelect={handleSelectCollection} />

      {/* Recipes Grid or Empty State */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pb-lg">
        {loading ? (
          <Loader />
        ) : recipes.length === 0 ? (
          <EmptyState
            icon={activeCollectionId ? 'folder_open' : 'heart_broken'}
            title={activeCollectionId ? 'No recipes in this collection' : 'No favorites yet'}
            message={
              activeCollectionId
                ? 'Open a recipe and tap "Add to Collection" to organize your favorites.'
                : 'Explore recipes and tap the heart icon to save your favorites here!'
            }
            actionLabel={activeCollectionId ? null : 'Explore Recipes'}
            onAction={activeCollectionId ? null : () => navigate('/home')}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md"
          >
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 280, damping: 26 }}
                className="flex"
              >
                <RecipeImageCard recipe={recipe} onClick={setSelectedRecipe} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetails recipe={selectedRecipe} onClose={handleCloseDetails} />
        )}
      </AnimatePresence>

    </main>
  );
}

export default FavoritesPage;
