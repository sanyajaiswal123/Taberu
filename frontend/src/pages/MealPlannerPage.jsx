import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  getMealPlan,
  addMealPlanItem,
  removeMealPlanItem,
  moveMealPlanItem,
  getShoppingList,
  toggleShoppingCheck,
  getFavorites,
} from '../services/api';
import RecipeDetails from '../components/RecipeDetails';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import { toTitleCase } from '../utils/formatText';

// ── Date helpers ──────────────────────────────────────────────────────────────

function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeek(monday) {
  return monday.toISOString().split('T')[0];
}

function formatWeekLabel(monday) {
  const end = new Date(monday);
  end.setDate(end.getDate() + 6);
  return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_SLOT_COLORS = {
  breakfast: 'border-l-secondary-container',
  lunch: 'border-l-sage',
  dinner: 'border-l-primary',
  snack: 'border-l-secondary',
};
const MEAL_ICONS = { breakfast: 'wb_sunny', lunch: 'partly_cloudy_day', dinner: 'bedtime', snack: 'nutrition' };
const SHOPPING_CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Spices', 'Other'];

// ── Recipe picker modal ───────────────────────────────────────────────────────

function RecipePicker({ onSelect, onClose }) {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = favorites.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-md bg-deep/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-blush"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-md border-b border-blush flex items-center justify-between">
          <h3 className="font-headline-md text-deep">Pick a Recipe</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-deep-muted hover:bg-blush transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-sm border-b border-blush/20">
          <div className="flex items-center bg-cream-light border border-blush rounded-xl px-sm py-2 focus-within:border-terra-dark transition-all">
            <span className="material-symbols-outlined text-[18px] text-deep-muted/60 mr-1">search</span>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search favorites..."
              className="flex-1 bg-transparent font-body-sm text-deep focus:outline-none placeholder:text-deep-muted/50"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-lg flex justify-center"><Loader /></div>
          ) : filtered.length === 0 ? (
            <p className="p-lg font-body-sm text-center text-deep-muted">
              {favorites.length === 0 ? 'Save some favorites first!' : 'No matches.'}
            </p>
          ) : (
            filtered.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onSelect(recipe)}
                className="w-full flex items-center gap-sm px-md py-sm hover:bg-surface-container-low transition-colors border-b border-blush/20 last:border-0 text-left cursor-pointer"
              >
                <span className="text-2xl flex-shrink-0">{recipe.emoji}</span>
                <div className="min-w-0">
                  <p className="font-body-sm font-bold text-deep truncate">{recipe.title}</p>
                  <p className="font-label-md text-deep-muted">{toTitleCase(recipe.cuisine)} · {recipe.cookTime}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Meal slot cell ────────────────────────────────────────────────────────────

function SlotCell({ item, dayIndex, slot, weekStart, onAdd, onRemove, onViewRecipe, dragging, onDragStart, onDrop }) {
  const isEmpty = !item;
  const hasImage = !isEmpty && item.recipe?.image;

  return (
    <div
      className={`relative rounded-lg overflow-hidden transition-all min-h-[96px] ${
        isEmpty
          ? 'border border-dashed border-blush hover:bg-blush-light/50 cursor-pointer'
          : hasImage
            ? 'shadow-sm hover-lift'
            : 'border border-blush bg-surface-container-lowest shadow-sm hover-lift'
      } ${dragging?.dayIndex === dayIndex && dragging?.slot === slot ? 'opacity-50' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(dayIndex, slot)}
      onClick={isEmpty ? () => onAdd(dayIndex, slot) : undefined}
    >
      {isEmpty ? (
        <div className="h-full min-h-[96px] flex items-center justify-center text-deep-muted/25 hover:text-deep-muted/50 transition-colors">
          <span className="material-symbols-outlined text-[22px]">add</span>
        </div>
      ) : hasImage ? (
        <div
          draggable
          onDragStart={() => onDragStart(item, dayIndex, slot)}
          className="relative min-h-[96px] h-full cursor-grab active:cursor-grabbing"
        >
          <img
            src={item.recipe.image}
            alt={item.recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-white/80 hover:bg-black/70 cursor-pointer transition-colors z-10"
            aria-label="Remove"
          >
            <span className="material-symbols-outlined text-[11px]">close</span>
          </button>
          <button
            onClick={() => onViewRecipe(item.recipe)}
            className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5 pt-4 text-left cursor-pointer z-10"
          >
            <span className="font-label-md text-white leading-tight line-clamp-2 drop-shadow">{item.recipe.title}</span>
          </button>
        </div>
      ) : (
        <div
          draggable
          onDragStart={() => onDragStart(item, dayIndex, slot)}
          className="p-2 cursor-grab active:cursor-grabbing h-full min-h-[96px]"
        >
          <div className="flex items-start justify-between gap-1">
            <button
              onClick={() => onViewRecipe(item.recipe)}
              className="flex items-center gap-1.5 flex-1 min-w-0 text-left cursor-pointer"
            >
              <span className="text-sm flex-shrink-0">{item.recipe.emoji}</span>
              <span className="font-label-md text-deep leading-tight line-clamp-2">{item.recipe.title}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="text-deep-muted/50 hover:text-error flex-shrink-0 cursor-pointer"
              aria-label="Remove"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
          {item.recipe.cookTime && (
            <p className="font-label-md text-deep-muted mt-1 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              {item.recipe.cookTime}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Shopping List panel ───────────────────────────────────────────────────────

function ShoppingListPanel({ weekStart }) {
  const [shopData, setShopData] = useState(null);
  const [checks, setChecks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getShoppingList(weekStart)
      .then(({ groups, checks: c }) => {
        setShopData(groups);
        const initial = {};
        Object.values(c).forEach((check) => {
          initial[check.ingredient_name.toLowerCase()] = check.is_checked;
        });
        setChecks(initial);
      })
      .catch(() => setShopData({}))
      .finally(() => setLoading(false));
  }, [weekStart]);

  const handleCheck = async (name, checked) => {
    const key = name.toLowerCase();
    setChecks((prev) => ({ ...prev, [key]: checked }));
    try {
      await toggleShoppingCheck({ ingredientName: name, isChecked: checked, weekStartDate: weekStart });
    } catch {
      setChecks((prev) => ({ ...prev, [key]: !checked }));
    }
  };

  const copyToClipboard = () => {
    const lines = [];
    SHOPPING_CATEGORIES.forEach((cat) => {
      const items = shopData?.[cat];
      if (!items?.length) return;
      lines.push(`\n${cat}:`);
      items.forEach(({ name }) => {
        if (!checks[name.toLowerCase()]) lines.push(`  • ${toTitleCase(name)}`);
      });
    });
    navigator.clipboard.writeText(lines.join('\n').trim()).catch(() => {});
  };

  if (loading) return <div className="p-lg flex justify-center"><Loader /></div>;

  const hasItems = shopData && Object.values(shopData).some((g) => g.length > 0);

  if (!hasItems) {
    return (
      <p className="font-body-sm text-center text-deep-muted py-lg">
        Add recipes to your plan to generate a shopping list.
      </p>
    );
  }

  return (
    <div className="space-y-md">
      <div className="flex justify-end">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 font-label-lg text-terra-dark hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
          Copy unchecked items
        </button>
      </div>

      {SHOPPING_CATEGORIES.map((cat) => {
        const items = shopData?.[cat];
        if (!items?.length) return null;
        return (
          <div key={cat}>
            <h4 className="font-label-md text-deep-muted uppercase tracking-wider mb-sm">{cat}</h4>
            <div className="space-y-1">
              {items.map(({ name, recipes }) => {
                const key = name.toLowerCase();
                const checked = checks[key] ?? false;
                return (
                  <label key={name} className="flex items-start gap-sm py-xs border-b border-blush/50 last:border-0 cursor-pointer hover:bg-surface-container-low rounded-lg px-sm transition-colors">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => handleCheck(name, e.target.checked)}
                      className="mt-0.5 accent-terra-dark"
                    />
                    <div>
                      <span className={`font-body-sm ${checked ? 'line-through text-deep-muted/50' : 'text-deep'}`}>{toTitleCase(name)}</span>
                      {recipes.length > 0 && (
                        <p className="font-label-md text-deep-muted/70">{[...new Set(recipes)].join(', ')}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MealPlannerPage() {
  const [monday, setMonday] = useState(() => getMondayOf(new Date()));
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [picker, setPicker] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [showShopping, setShowShopping] = useState(false);
  const [dragging, setDragging] = useState(null);

  const weekStart = formatWeek(monday);
  const todayIdx = ((new Date().getDay() + 6) % 7); // Mon=0 ... Sun=6

  const loadPlan = useCallback(() => {
    setLoading(true);
    getMealPlan(weekStart)
      .then(setPlan)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [weekStart]);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  const getItem = (dayIndex, slot) =>
    plan?.items?.find((i) => i.day_of_week === dayIndex && i.meal_slot === slot);

  const handleAdd = (dayIndex, slot) => setPicker({ dayIndex, slot });

  const handlePickRecipe = async (recipe) => {
    if (!picker) return;
    try {
      const newItem = await addMealPlanItem({
        recipeId: recipe.id,
        weekStartDate: weekStart,
        dayOfWeek: picker.dayIndex,
        mealSlot: picker.slot,
      });
      setPlan((prev) => ({
        ...prev,
        items: [
          ...(prev?.items ?? []).filter(
            (i) => !(i.day_of_week === picker.dayIndex && i.meal_slot === picker.slot)
          ),
          newItem,
        ],
      }));
    } catch {}
    setPicker(null);
  };

  const handleRemove = async (itemId) => {
    try {
      await removeMealPlanItem(itemId);
      setPlan((prev) => ({ ...prev, items: (prev?.items ?? []).filter((i) => i.id !== itemId) }));
    } catch {}
  };

  const handleDragStart = (item, dayIndex, slot) => setDragging({ item, dayIndex, slot });

  const handleDrop = async (targetDay, targetSlot) => {
    if (!dragging) return;
    if (dragging.dayIndex === targetDay && dragging.slot === targetSlot) {
      setDragging(null);
      return;
    }
    try {
      const updated = await moveMealPlanItem(dragging.item.id, { dayOfWeek: targetDay, mealSlot: targetSlot });
      setPlan((prev) => {
        const items = (prev?.items ?? []).filter(
          (i) => i.id !== dragging.item.id &&
            !(i.day_of_week === targetDay && i.meal_slot === targetSlot)
        );
        return { ...prev, items: [...items, updated] };
      });
    } catch {}
    setDragging(null);
  };

  const prevWeek = () => setMonday((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
  const nextWeek = () => setMonday((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });

  return (
    <main className="flex-1 bg-background">

      {/* Header */}
      <section className="bg-gradient-to-r from-blush-light via-cream-light to-blush-light border-b border-blush pt-xl pb-lg px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display-lg-mobile md:font-display-lg text-deep">Meal Planner</h1>
          <p className="font-body-lg text-deep-muted mt-sm">Plan your week, generate a shopping list.</p>
        </div>
      </section>

      {/* Controls row */}
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-lg pb-sm flex flex-col md:flex-row justify-between items-center gap-md">
        {/* Week nav */}
        <div className="flex items-center bg-cream-light border border-blush rounded-xl shadow-sm px-xs space-x-md">
          <button
            onClick={prevWeek}
            className="p-2 hover:bg-surface-variant rounded-lg text-terra-dark transition-colors cursor-pointer"
            aria-label="Previous week"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="font-label-lg text-deep py-2">{formatWeekLabel(monday)}</span>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-surface-variant rounded-lg text-terra-dark transition-colors cursor-pointer"
            aria-label="Next week"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        {/* Shopping list button */}
        <button
          onClick={() => setShowShopping((s) => !s)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-label-lg rounded-lg hover-lift transition-colors shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          {showShopping ? 'Hide' : 'Generate'} Shopping List
        </button>
      </div>

      {/* Calendar grid */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pb-lg">
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[860px] border border-blush rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-cream-light border-b border-blush">
                <div className="p-sm flex items-end justify-center pb-2">
                  <span className="font-label-md text-deep-muted/60 uppercase tracking-widest text-[9px]">TIME</span>
                </div>
                {DAY_NAMES.map((day, i) => {
                  const isToday = i === todayIdx;
                  const dayDate = new Date(monday);
                  dayDate.setDate(dayDate.getDate() + i);
                  return (
                    <div
                      key={day}
                      className={`p-sm text-center border-l border-blush ${isToday ? 'bg-blush-light/30 border-t-[3px] border-t-terra-dark' : ''}`}
                    >
                      <div className={`font-label-md uppercase ${isToday ? 'text-terra-dark font-bold' : 'text-deep-muted'}`}>{day}</div>
                      <div className={`font-headline-md ${isToday ? 'text-terra-dark font-bold' : 'text-deep'}`}>
                        {dayDate.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meal slot rows */}
              {MEAL_SLOTS.map((slot) => (
                <div key={slot} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-blush/30 last:border-0">
                  <div className={`bg-cream-light border-r border-blush border-l-[3px] ${MEAL_SLOT_COLORS[slot]} flex items-center justify-center py-2`}>
                    <span className="font-label-md text-deep-muted capitalize [writing-mode:vertical-rl] rotate-180 tracking-wide text-[11px]">
                      {slot}
                    </span>
                  </div>
                  {DAY_NAMES.map((_, dayIndex) => (
                    <div key={dayIndex} className="p-1 border-l border-blush/30">
                      <SlotCell
                        item={getItem(dayIndex, slot)}
                        dayIndex={dayIndex}
                        slot={slot}
                        weekStart={weekStart}
                        onAdd={handleAdd}
                        onRemove={handleRemove}
                        onViewRecipe={setViewRecipe}
                        dragging={dragging}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopping list panel */}
        <AnimatePresence>
          {showShopping && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="overflow-hidden mt-lg"
            >
              <div className="bg-surface border border-blush rounded-2xl p-md">
                <h3 className="font-headline-md text-deep mb-md">Shopping List</h3>
                <ShoppingListPanel weekStart={weekStart} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {picker && (
          <RecipePicker
            onSelect={handlePickRecipe}
            onClose={() => setPicker(null)}
          />
        )}
      </AnimatePresence>
        
      <AnimatePresence>
        {viewRecipe && (
          <RecipeDetails recipe={viewRecipe} onClose={() => setViewRecipe(null)} />
        )}
      </AnimatePresence>
      
      <Footer />
    </main>

  );
}
