import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useCollections } from '../context/CollectionsContext';
import { useAuth } from '../context/AuthContext';
import { addToRecentlyViewed } from './RecentlyViewed';
import {
  incrementView,
  getRecipeNote,
  upsertRecipeNote,
  getCookCountForRecipe,
  logCook,
} from '../services/api';
import RatingStars from './RatingStars';
import DifficultyBadge from './DifficultyBadge';
import { ingredientName, toTitleCase } from '../utils/formatText';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// ── "Add to Collection" dropdown ──────────────────────────────────────────────
function AddToCollectionButton({ recipeId }) {
  const { collections, addToCollection } = useCollections();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (collections.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-md py-sm bg-cream-light border border-blush text-deep font-label-lg rounded-lg lift-hover flex-shrink-0 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
        Add to Collection
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute top-full left-0 mt-1 w-48 bg-surface rounded-xl shadow-lg border border-blush py-1 z-30 origin-top-left"
          >
            {collections.map((col) => (
              <motion.button
                key={col.id}
                whileHover={{ x: 3 }}
                onClick={async () => {
                  try { await addToCollection(col.id, recipeId); } catch {}
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-body-sm text-deep hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
              >
                {col.emoji && <span>{col.emoji}</span>}
                {col.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── "My Notes" collapsible section ────────────────────────────────────────────
function MyNotes({ recipeId }) {
  const [open, setOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [saved, setSaved] = useState(false);
  const [lastEdited, setLastEdited] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    getRecipeNote(recipeId)
      .then((note) => {
        if (note) {
          setNoteText(note.note_text);
          setLastEdited(note.updated_at);
        }
      })
      .catch(() => {});
  }, [open, recipeId]);

  const handleChange = (e) => {
    const val = e.target.value;
    setNoteText(val);
    setSaved(false);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!val.trim()) return;
      try {
        const note = await upsertRecipeNote(recipeId, val);
        setSaved(true);
        setLastEdited(note.updated_at);
      } catch {}
    }, 500);
  };

  return (
    <div className="border-t border-blush pt-md">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 font-body-lg font-bold text-deep cursor-pointer hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">notes</span>
        My Notes
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          className="material-symbols-outlined text-[16px] text-deep-muted"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="overflow-hidden"
          >
            <div className="mt-sm">
              <textarea
                value={noteText}
                onChange={handleChange}
                placeholder="Add your notes — adjustments, tips, substitutions..."
                rows={4}
                className="w-full font-body-sm text-deep border border-blush rounded-xl px-sm py-sm resize-none focus:outline-none focus:border-terra-dark focus:ring-1 focus:ring-terra-dark bg-cream-light transition-all"
              />
              <div className="flex items-center gap-2 mt-1 font-label-md text-deep-muted">
                {saved && <span className="text-tertiary-container">✓ Saved</span>}
                {lastEdited && !saved && (
                  <span>Last edited {new Date(lastEdited).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── "Mark as Cooked" section ──────────────────────────────────────────────────
function MarkAsCooked({ recipeId }) {
  const [cookCount, setCookCount] = useState(null);
  const [lastCooked, setLastCooked] = useState(null);
  const [marking, setMarking] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getCookCountForRecipe(recipeId)
      .then(({ count, last_cooked_at }) => {
        setCookCount(count);
        setLastCooked(last_cooked_at);
      })
      .catch(() => {});
  }, [recipeId]);

  const handleMark = async () => {
    setMarking(true);
    try {
      await logCook({ recipeId, rating: rating || undefined });
      setCookCount((c) => (c ?? 0) + 1);
      setLastCooked(new Date().toISOString());
      setShowRating(false);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="border-t border-blush pt-md">
      <div className="flex flex-wrap items-center gap-sm">
        <motion.button
          onClick={() => setShowRating((s) => !s)}
          disabled={marking}
          whileHover={!marking ? { scale: 1.03, y: -1 } : {}}
          whileTap={!marking ? { scale: 0.97 } : {}}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="flex items-center gap-2 px-md py-sm bg-primary text-on-primary font-label-lg rounded-lg hover-lift transition-colors cursor-pointer disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
          {done ? 'Logged!' : 'Mark as Cooked'}
        </motion.button>

        {cookCount !== null && cookCount > 0 && (
          <span className="font-body-sm text-deep-muted">
            Cooked {cookCount} time{cookCount !== 1 ? 's' : ''}
            {lastCooked && ` · Last: ${new Date(lastCooked).toLocaleDateString()}`}
          </span>
        )}
      </div>

      <AnimatePresence>
        {showRating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="mt-sm flex items-center gap-sm">
              <span className="font-body-sm text-deep-muted">Your rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating((r) => (r === star ? 0 : star))}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`text-xl cursor-pointer ${star <= rating ? 'text-secondary-container' : 'text-blush'}`}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
              <motion.button
                onClick={handleMark}
                disabled={marking}
                whileHover={!marking ? { scale: 1.05 } : {}}
                whileTap={!marking ? { scale: 0.96 } : {}}
                className="ml-2 px-sm py-xs bg-terra-dark text-on-primary font-label-md rounded-lg hover:bg-primary transition-colors cursor-pointer disabled:opacity-60"
              >
                Log
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────────
function RecipeDetails({ recipe, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [imgError, setImgError] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const focusable = modalRef.current?.querySelectorAll(FOCUSABLE);
    focusable?.[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const els = modalRef.current?.querySelectorAll(FOCUSABLE);
      if (!els?.length) return;
      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    if (recipe) {
      addToRecentlyViewed(recipe);
      incrementView(recipe.id);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, recipe]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!recipe) return null;

  const favorited = isFavorite(recipe.id);
  const ingredients = recipe.ingredients ?? [];

  return (
    <motion.div
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-md bg-deep/60 backdrop-blur-sm"
      id="recipe-details-overlay"
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="relative bg-surface rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blush"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl bg-surface-container">
          {recipe.image && !imgError ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${recipe.gradient || 'from-blush to-terra'} flex items-center justify-center`}
            >
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
                className="text-8xl drop-shadow-lg"
              >
                {recipe.emoji}
              </motion.span>
            </div>
          )}

          {/* Close button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="absolute top-md right-md w-10 h-10 bg-cream-light/90 backdrop-blur-sm border border-blush rounded-full flex items-center justify-center hover:bg-blush transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px] text-deep">close</span>
          </motion.button>

          {recipe.type && (
            <span className="absolute top-md left-md font-label-md px-3 py-1 rounded-full bg-surface/90 shadow-sm text-deep">
              {recipe.type === 'veg' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-md md:p-lg flex flex-col gap-md">

          {/* Title */}
          <motion.h2
            id="recipe-modal-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.08 }}
            className="font-headline-lg text-deep"
          >
            {recipe.title}
          </motion.h2>

          {/* Rating */}
          {recipe.rating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              <RatingStars rating={recipe.rating} reviewCount={recipe.reviewCount} />
            </motion.div>
          )}

          {/* Meta chips */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-sm"
          >
            {recipe.cookTime && (
              <span className="flex items-center gap-1 px-3 py-1 bg-surface-container-low border border-blush rounded-full font-label-md text-deep">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {recipe.cookTime}
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1 px-3 py-1 bg-surface-container-low border border-blush rounded-full font-label-md text-deep">
                <span className="material-symbols-outlined text-[14px]">group</span>
                {recipe.servings} servings
              </span>
            )}
            {recipe.cuisine && (
              <span className="px-3 py-1 bg-sage/20 text-tertiary-container font-label-md rounded-full">
                {toTitleCase(recipe.cuisine)}
              </span>
            )}
            <DifficultyBadge difficulty={recipe.difficulty} />
          </motion.div>

          {/* Favorite + collection row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap items-center gap-sm"
          >
            <motion.button
              onClick={() => toggleFavorite(recipe.id)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className={`flex items-center gap-2 px-md py-sm rounded-xl font-label-lg transition-colors cursor-pointer ${
                favorited
                  ? 'bg-error-container/40 border-2 border-error/30 text-error'
                  : 'border-2 border-blush text-deep-muted hover:border-terra-dark hover:text-terra-dark'
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              {favorited ? 'Saved to Favorites' : 'Add to Favorites'}
            </motion.button>

            {isAuthenticated && favorited && (
              <AddToCollectionButton recipeId={recipe.id} />
            )}
          </motion.div>

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-headline-md text-deep border-b border-blush pb-xs mb-sm">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <motion.span
                    key={typeof ingredient === 'object' ? ingredient.id : index}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.22 + index * 0.03 }}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blush-light border border-blush font-body-sm text-deep"
                  >
                    {ingredientName(ingredient)}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          {recipe.instructions?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              <h3 className="font-headline-md text-deep border-b border-blush pb-xs mb-sm">
                Instructions
              </h3>
              <ol className="space-y-sm">
                {recipe.instructions.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.28 + index * 0.04 }}
                    className="bg-surface-container-low rounded-xl p-sm border border-blush flex gap-sm"
                  >
                    <span className="flex-shrink-0 w-7 h-7 bg-primary-container text-on-primary font-bold rounded-full flex items-center justify-center font-label-lg mt-0.5">
                      {index + 1}
                    </span>
                    <p className="font-body-sm text-deep-muted leading-relaxed">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}

          {/* Auth-gated sections */}
          {isAuthenticated && (
            <>
              <MarkAsCooked recipeId={recipe.id} />
              <MyNotes recipeId={recipe.id} />
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RecipeDetails;
