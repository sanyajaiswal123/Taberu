import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetOverview, adminGetPopularRecipes } from '../../services/api';
import Loader from '../../components/Loader';
import { toTitleCase } from '../../utils/formatText';

const STAT_CONFIG = [
  { key: 'total_users',       label: 'Total Users',      icon: 'group',                accent: 'border-t-primary' },
  { key: 'total_recipes',     label: 'Total Recipes',    icon: 'menu_book',            accent: 'border-t-secondary-container' },
  { key: 'total_favorites',   label: 'Total Favorites',  icon: 'favorite',             accent: 'border-t-error' },
  { key: 'total_cooks_today', label: 'Cooks Today',      icon: 'restaurant',           accent: 'border-t-sage' },
  { key: 'active_this_week',  label: 'Active This Week', icon: 'local_fire_department', accent: 'border-t-gold' },
];

function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`bg-surface rounded-2xl border border-outline-variant p-md flex items-center gap-sm border-t-[3px] ${accent}`}>
      <div className="w-10 h-10 rounded-full bg-blush-light flex items-center justify-center flex-shrink-0">
        <span
          className="material-symbols-outlined text-[20px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <div className="font-headline-lg text-deep font-bold leading-tight">{value ?? '—'}</div>
        <div className="font-label-md text-deep-muted mt-1 leading-normal">{label}</div>
      </div>
    </div>
  );
}

function HighlightRow({ emoji, label, sublabel, badge, badgeColor = 'bg-blush text-deep' }) {
  return (
    <div className="flex items-center gap-sm py-3 border-b border-blush/20 last:border-0">
      <span className="text-2xl w-8 text-center flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-body-sm font-semibold text-deep truncate leading-snug">{label}</p>
        <p className="font-label-md text-deep-muted mt-0.5 leading-normal">{sublabel}</p>
      </div>
      <span className={`font-label-md px-2 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0 ${badgeColor}`}>
        {badge}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [popularByViews, setPopularByViews] = useState([]);
  const [popularByFavs, setPopularByFavs] = useState([]);
  const [popularByCooks, setPopularByCooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminGetOverview(),
      adminGetPopularRecipes('views'),
      adminGetPopularRecipes('favorites'),
      adminGetPopularRecipes('cooks'),
    ])
      .then(([ov, pv, pf, pc]) => {
        setOverview(ov);
        setPopularByViews(pv.slice(0, 10));
        setPopularByFavs(pf.slice(0, 3));
        setPopularByCooks(pc.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  const topByViews = popularByViews[0];
  const topByFavs  = popularByFavs[0];
  const topByCooks = popularByCooks[0];

  return (
    <AdminLayout>
      <h1 className="font-headline-lg text-deep mb-md">Dashboard</h1>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-sm mb-lg">
        {STAT_CONFIG.map((cfg) => (
          <StatCard
            key={cfg.key}
            label={cfg.label}
            value={overview?.[cfg.key]}
            icon={cfg.icon}
            accent={cfg.accent}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">

        {/* Recipe Highlights — replaces the old "Content Gaps" panel */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-md">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-md text-deep">Recipe Highlights</h2>
            <span className="font-label-md text-deep-muted leading-normal">All time · Top picks</span>
          </div>

          <div>
            {topByViews && (
              <HighlightRow
                emoji={topByViews.emoji}
                label={topByViews.title}
                sublabel={`${toTitleCase(topByViews.cuisine)} · Most viewed`}
                badge={`${topByViews.view_count} views`}
                badgeColor="bg-secondary-container/30 text-secondary"
              />
            )}
            {topByFavs && (
              <HighlightRow
                emoji={topByFavs.emoji}
                label={topByFavs.title}
                sublabel={`${toTitleCase(topByFavs.cuisine)} · Most saved`}
                badge={`${topByFavs.favorites_count} saves`}
                badgeColor="bg-error-container/30 text-error"
              />
            )}
            {topByCooks && (
              <HighlightRow
                emoji={topByCooks.emoji}
                label={topByCooks.title}
                sublabel={`${toTitleCase(topByCooks.cuisine)} · Most cooked`}
                badge={`${topByCooks.cook_logs_count} cooks`}
                badgeColor="bg-sage/30 text-tertiary"
              />
            )}
            {!topByViews && !topByFavs && !topByCooks && (
              <p className="font-body-sm text-deep-muted text-center py-md">No recipe data yet.</p>
            )}
          </div>

          {/* Summary mini-grid */}
          {overview && (
            <div className="mt-md pt-md border-t border-blush/20 grid grid-cols-3 gap-sm text-center">
              <div>
                <p className="font-headline-md text-deep font-bold leading-tight">{overview.total_recipes}</p>
                <p className="font-label-md text-deep-muted leading-normal mt-1">Recipes</p>
              </div>
              <div>
                <p className="font-headline-md text-deep font-bold leading-tight">{overview.total_favorites}</p>
                <p className="font-label-md text-deep-muted leading-normal mt-1">Saves</p>
              </div>
              <div>
                <p className="font-headline-md text-deep font-bold leading-tight">{overview.active_this_week}</p>
                <p className="font-label-md text-deep-muted leading-normal mt-1">Active Users</p>
              </div>
            </div>
          )}
        </div>

        {/* Popular This Week */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-md">
          <h2 className="font-headline-md text-deep mb-md">Popular This Week</h2>
          {popularByViews.length === 0 ? (
            <p className="font-body-sm text-deep-muted text-center py-md">No data yet.</p>
          ) : (
            <div>
              {popularByViews.map((recipe, i) => (
                <div key={recipe.id} className="flex items-center gap-sm py-2.5 border-b border-blush/20 last:border-0">
                  <span className="font-label-md text-deep-muted/50 w-4 text-right flex-shrink-0">{i + 1}</span>
                  <span className="text-lg flex-shrink-0">{recipe.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-sm font-semibold text-deep truncate leading-snug">{recipe.title}</p>
                    <p className="font-label-md text-deep-muted mt-0.5 leading-normal">{toTitleCase(recipe.cuisine)}</p>
                  </div>
                  <span className="font-label-md text-deep-muted flex-shrink-0">{recipe.view_count} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
