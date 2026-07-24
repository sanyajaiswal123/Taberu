import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  adminGetSearchGaps,
  adminGetPopularRecipes,
  adminGetTrendingSearches,
  adminGetEngagement,
} from '../../services/api';
import Loader from '../../components/Loader';

const SORT_OPTS = [
  { value: 'views',     label: 'Views' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'cooks',     label: 'Cooks' },
];

const DAYS_OPTS = [
  { value: 7,  label: '7 days' },
  { value: 30, label: '30 days' },
];

const popColors = ['bg-primary', 'bg-secondary-container', 'bg-sage', 'bg-gold', 'bg-error-container'];

function HorizontalBar({ label, value, max, color = 'bg-primary' }) {
  return (
    <div className="flex items-center gap-sm py-1">
      <span className="font-body-sm text-deep w-36 truncate">{label}</span>
      <div className="flex-1 h-2 bg-blush-light rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}
        />
      </div>
      <span className="font-label-md text-deep-muted w-8 text-right">{value}</span>
    </div>
  );
}

export default function AdminAnalytics() {
  const [gaps, setGaps] = useState([]);
  const [popular, setPopular] = useState([]);
  const [sort, setSort] = useState('views');
  const [trending, setTrending] = useState([]);
  const [days, setDays] = useState(7);
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminGetSearchGaps(),
      adminGetPopularRecipes(sort),
      adminGetTrendingSearches(days),
      adminGetEngagement(),
    ])
      .then(([g, p, t, e]) => {
        setGaps(g);
        setPopular(p);
        setTrending(t);
        setEngagement(e);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [sort, days]);

  const popularMax = popular.length
    ? Math.max(...popular.map((r) => sort === 'favorites' ? r.favorites_count : sort === 'cooks' ? r.cook_logs_count : r.view_count))
    : 0;

  const trendingMax = trending.length ? Math.max(...trending.map((t) => t.count)) : 0;

  return (
    <AdminLayout>
      <h1 className="font-headline-lg text-deep mb-md">Analytics</h1>

      {loading ? <Loader /> : (
        <div className="space-y-md">

          {/* Trending Searches */}
          <section className="bg-surface rounded-2xl border border-outline-variant p-md">
            <div className="flex items-center justify-between mb-sm">
              <h2 className="font-headline-md text-deep">Trending Searches</h2>
              <div className="flex gap-xs">
                {DAYS_OPTS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDays(opt.value)}
                    className={`font-label-md px-sm py-1 rounded-full border transition-colors cursor-pointer ${
                      days === opt.value
                        ? 'bg-terra-dark text-on-primary border-terra-dark'
                        : 'border-blush text-deep-muted hover:border-terra-dark bg-cream-light'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {trending.length === 0 ? (
              <p className="font-body-sm text-deep-muted text-center py-md">No search data yet.</p>
            ) : (
              <div className="space-y-0.5">
                {trending.map((t, i) => (
                  <HorizontalBar
                    key={t.query_value}
                    label={t.query_value}
                    value={t.count}
                    max={trendingMax}
                    color={popColors[i % popColors.length]}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Popular Recipes */}
          <section className="bg-surface rounded-2xl border border-outline-variant p-md">
            <div className="flex items-center justify-between mb-sm">
              <h2 className="font-headline-md text-deep">Popular Recipes</h2>
              <div className="flex gap-xs">
                {SORT_OPTS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`font-label-md px-sm py-1 rounded-full border transition-colors cursor-pointer ${
                      sort === opt.value
                        ? 'bg-terra-dark text-on-primary border-terra-dark'
                        : 'border-blush text-deep-muted hover:border-terra-dark bg-cream-light'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {popular.length === 0 ? (
              <p className="font-body-sm text-deep-muted text-center py-md">No recipe data yet.</p>
            ) : (
              <div className="space-y-0.5">
                {popular.slice(0, 15).map((r, i) => (
                  <HorizontalBar
                    key={r.id}
                    label={`${r.emoji} ${r.title}`}
                    value={sort === 'favorites' ? r.favorites_count : sort === 'cooks' ? r.cook_logs_count : r.view_count}
                    max={popularMax}
                    color={popColors[i % popColors.length]}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Search Gaps */}
          <section className="bg-surface rounded-2xl border border-outline-variant p-md">
            <h2 className="font-headline-md text-deep mb-sm">
              Search Gaps{' '}
              <span className="font-label-md text-deep-muted font-normal">(0-result searches)</span>
            </h2>
            {gaps.length === 0 ? (
              <p className="font-body-sm text-deep-muted text-center py-md">No gaps! All searches return results.</p>
            ) : (
              <table className="w-full">
                <thead className="border-b border-blush/20">
                  <tr>
                    <th className="text-left py-xs font-label-md text-deep-muted uppercase tracking-wider">Search Query</th>
                    <th className="text-right py-xs font-label-md text-deep-muted uppercase tracking-wider">Searches</th>
                  </tr>
                </thead>
                <tbody>
                  {gaps.map((g) => (
                    <tr key={g.query_value} className="border-b border-blush/10 last:border-0">
                      <td className="py-xs font-body-sm text-deep">{g.query_value}</td>
                      <td className="py-xs text-right font-body-sm text-deep-muted">{g.search_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Engagement */}
          {engagement && (
            <section className="bg-surface rounded-2xl border border-outline-variant p-md">
              <h2 className="font-headline-md text-deep mb-sm">Engagement</h2>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <p className="font-label-md text-deep-muted mb-xs uppercase tracking-wider">Favorites Distribution</p>
                  {Object.entries(engagement.favorites_distribution ?? {}).map(([bucket, count], i) => (
                    <HorizontalBar
                      key={bucket}
                      label={`${bucket} favs`}
                      value={count}
                      max={Math.max(...Object.values(engagement.favorites_distribution))}
                      color={popColors[i % popColors.length]}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center bg-surface-container-low rounded-2xl p-md">
                  <span className="font-headline-lg font-bold text-deep">{engagement.avg_cooks_per_user}</span>
                  <span className="font-label-md text-deep-muted mt-1">Avg cooks per active user</span>
                </div>
              </div>
            </section>
          )}

        </div>
      )}
    </AdminLayout>
  );
}
