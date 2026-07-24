import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCookStats, getCookLog, deleteCookLog } from '../services/api';
import RecipeDetails from '../components/RecipeDetails';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '../utils/formatText';

const STAT_CONFIG = [
  { key: 'total_cooked',    label: 'Total Cooked',    icon: 'restaurant',          accent: 'border-l-primary' },
  { key: 'unique_recipes',  label: 'Unique Recipes',  icon: 'menu_book',           accent: 'border-l-sage' },
  { key: 'streak_current',  label: 'Day Streak',      icon: 'local_fire_department', accent: 'border-l-secondary-container' },
  { key: 'this_month',      label: 'This Month',      icon: 'calendar_today',      accent: 'border-l-rosewood-700' },
];

function StatCard({ label, value, icon, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, delay }}
      className={`bg-surface rounded-2xl border border-blush p-md border-l-4 ${accent} lift-hover cursor-default`}
    >
      <div className="flex items-start justify-between mb-sm">
        <span
          className="material-symbols-outlined text-[24px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="font-headline-lg text-deep font-bold">{value ?? '—'}</div>
      <div className="font-label-md text-deep-muted uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  );
}

function BarChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null;
  const max = Math.max(...Object.values(data));
  const colors = ['bg-primary', 'bg-secondary-container', 'bg-sage', 'bg-rosewood-700', 'bg-blush-dark'];

  return (
    <div className="space-y-sm">
      {Object.entries(data).map(([label, count], i) => (
        <div key={label} className="flex items-center gap-sm">
          <span className="font-body-sm text-deep-muted w-20 truncate">{toTitleCase(label)}</span>
          <div className="flex-1 h-1.5 bg-blush-light rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-500`}
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="font-label-md text-deep-muted w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [histPage, setHistPage] = useState(1);
  const [histMeta, setHistMeta] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCookStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const loadHistory = (page) => {
    setLoadingHistory(true);
    getCookLog(page, 20)
      .then(({ data, meta }) => {
        setHistory(page === 1 ? data : (prev) => [...prev, ...data]);
        setHistMeta(meta);
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => { loadHistory(histPage); }, [histPage]);

  const handleDeleteLog = async (id) => {
    try {
      await deleteCookLog(id);
      setHistory((prev) => prev.filter((entry) => entry.id !== id));
    } catch {}
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const statValues = {
    total_cooked:   stats?.total_cooked,
    unique_recipes: stats?.unique_recipes,
    streak_current: stats?.streak?.current != null ? `${stats.streak.current}d` : '0d',
    this_month:     stats?.this_month,
  };

  return (
    <main className="flex-1 bg-background min-h-screen">

      {/* Profile header */}
      <section className="bg-gradient-to-r from-blush via-cream-light to-blush-light border-b border-blush py-lg px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blush to-cream-light p-lg flex flex-col md:flex-row items-center gap-lg border border-blush">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary border-[3px] border-terra-dark overflow-hidden shadow-sm flex-shrink-0 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[32px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="font-headline-lg text-deep">{user?.name}</h1>
              {memberSince && (
                <p className="font-body-sm text-deep-muted mt-1">Member since {memberSince}</p>
              )}
              <div className="flex flex-wrap gap-sm mt-sm justify-center md:justify-start">
                <button
                  onClick={() => navigate('/favorites')}
                  className="flex items-center gap-1.5 px-md py-xs rounded-full bg-cream-light border border-blush text-deep font-label-md lift-hover cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  My Favorites
                </button>
                <button
                  onClick={() => navigate('/planner')}
                  className="flex items-center gap-1.5 px-md py-xs rounded-full bg-cream-light border border-blush text-deep font-label-md lift-hover cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">calendar_month</span>
                  Meal Planner
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-xl">

        {/* Bento stats grid */}
        {loadingStats ? <Loader /> : stats && (
          <section>
            <h2 className="font-headline-lg text-deep mb-md">Your Stats</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              {/* Left 2/3: 4 stat cards */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-sm">
                {STAT_CONFIG.map((cfg, i) => (
                  <StatCard
                    key={cfg.key}
                    label={cfg.label}
                    value={statValues[cfg.key]}
                    icon={cfg.icon}
                    accent={cfg.accent}
                    delay={i * 0.08}
                  />
                ))}
              </div>

              {/* Right 1/3: Cuisines breakdown */}
              {stats.cuisine_breakdown && Object.keys(stats.cuisine_breakdown).length > 0 && (
                <div className="bg-surface rounded-2xl border border-blush p-md lift-hover">
                  <h3 className="font-headline-md text-deep mb-md">Cuisine Map</h3>
                  <BarChart data={stats.cuisine_breakdown} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Most Cooked */}
        {stats?.top_5_recipes?.length > 0 && (
          <section>
            <h2 className="font-headline-lg text-deep mb-md">Most Cooked</h2>
            <div className="space-y-sm">
              {stats.top_5_recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full flex items-center gap-sm bg-surface rounded-2xl border border-blush px-md py-sm hover:border-terra-dark/50 transition-colors text-left cursor-pointer lift-hover"
                >
                  <span className="text-2xl flex-shrink-0">{recipe.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md font-bold text-deep truncate">{recipe.title}</p>
                    <p className="font-label-md text-deep-muted">{toTitleCase(recipe.cuisine)} · {toTitleCase(recipe.category)}</p>
                  </div>
                  <span className="font-label-md text-deep-muted flex-shrink-0">×{recipe.cook_count}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Cooking History */}
        <section>
          <h2 className="font-headline-lg text-deep mb-md">Cooking History</h2>
          {loadingHistory && history.length === 0 ? (
            <Loader />
          ) : history.length === 0 ? (
            <EmptyState
              icon="restaurant"
              title="No cooking history yet"
              message='Open any recipe and tap "Mark as Cooked" to start tracking.'
            />
          ) : (
            <>
              <div className="space-y-sm">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-sm bg-surface rounded-2xl border border-blush px-md py-sm lift-hover">
                    <button
                      onClick={() => setSelectedRecipe(entry.recipe)}
                      className="flex items-center gap-sm flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <span className="text-2xl flex-shrink-0">{entry.recipe?.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-body-md font-bold text-deep truncate">{entry.recipe?.title}</p>
                        <p className="font-label-md text-deep-muted">
                          {new Date(entry.cooked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {entry.rating && (
                            <span className="ml-2 text-secondary-container">
                              {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                            </span>
                          )}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteLog(entry.id)}
                      className="text-deep-muted hover:text-error transition-colors flex-shrink-0 cursor-pointer"
                      aria-label="Remove log entry"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ))}
              </div>

              {histMeta && histMeta.current_page < histMeta.last_page && (
                <button
                  onClick={() => setHistPage((p) => p + 1)}
                  disabled={loadingHistory}
                  className="mt-md w-full py-2 font-label-lg text-terra-dark hover:underline cursor-pointer disabled:opacity-60"
                >
                  {loadingHistory ? 'Loading…' : 'Load more'}
                </button>
              )}
            </>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetails recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
