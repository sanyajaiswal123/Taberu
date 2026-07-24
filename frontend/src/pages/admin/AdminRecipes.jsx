import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetRecipes, adminCreateRecipe, adminUpdateRecipe, adminDeleteRecipe } from '../../services/api';
import Loader from '../../components/Loader';
import { toTitleCase } from '../../utils/formatText';

const BLANK = {
  title: '', category: 'Dinner', cuisine: 'Indian', difficulty: 'Medium',
  cook_time: '30 mins', servings: 2, emoji: '🍽️', image: '', gradient: 'from-amber-400 to-orange-500',
  instructions: [''],
};

function RecipeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? BLANK);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addStep = () => set('instructions', [...(form.instructions ?? []), '']);
  const setStep = (i, val) => {
    const steps = [...(form.instructions ?? [])];
    steps[i] = val;
    set('instructions', steps);
  };
  const removeStep = (i) => set('instructions', (form.instructions ?? []).filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const fieldCls = 'w-full bg-cream-light border border-blush rounded-lg px-sm py-2 font-body-sm text-deep focus:outline-none focus:border-terra-dark transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-sm">
      <div className="grid grid-cols-2 gap-sm">
        <div className="col-span-2">
          <label className="font-label-md text-deep-muted mb-1 block">Title *</label>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} required className={fieldCls} />
        </div>
        <div>
          <label className="font-label-md text-deep-muted mb-1 block">Category</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className={`${fieldCls} cursor-pointer`}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="font-label-md text-deep-muted mb-1 block">Cuisine</label>
          <input value={form.cuisine} onChange={(e) => set('cuisine', e.target.value)} className={fieldCls} />
        </div>
        <div>
          <label className="font-label-md text-deep-muted mb-1 block">Difficulty</label>
          <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className={`${fieldCls} cursor-pointer`}>
            {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="font-label-md text-deep-muted mb-1 block">Cook Time</label>
          <input value={form.cook_time} onChange={(e) => set('cook_time', e.target.value)} className={fieldCls} />
        </div>
        <div>
          <label className="font-label-md text-deep-muted mb-1 block">Servings</label>
          <input type="number" min={1} value={form.servings} onChange={(e) => set('servings', +e.target.value)} className={fieldCls} />
        </div>
        <div>
          <label className="font-label-md text-deep-muted mb-1 block">Emoji</label>
          <input value={form.emoji} onChange={(e) => set('emoji', e.target.value)} className={fieldCls} maxLength={10} />
        </div>
        <div className="col-span-2">
          <label className="font-label-md text-deep-muted mb-1 block">Image URL</label>
          <input value={form.image ?? ''} onChange={(e) => set('image', e.target.value)} className={fieldCls} placeholder="https://..." />
        </div>
        <div className="col-span-2">
          <label className="font-label-md text-deep-muted mb-1 block">Gradient classes</label>
          <input value={form.gradient ?? ''} onChange={(e) => set('gradient', e.target.value)} className={fieldCls} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-xs">
          <label className="font-label-md text-deep-muted">Instructions *</label>
          <button type="button" onClick={addStep} className="font-label-md text-terra-dark hover:underline cursor-pointer">+ Add Step</button>
        </div>
        <div className="space-y-xs">
          {(form.instructions ?? ['']).map((step, i) => (
            <div key={i} className="flex gap-xs items-start">
              <span className="font-label-md text-deep-muted mt-2.5 w-4">{i + 1}.</span>
              <textarea
                value={step}
                onChange={(e) => setStep(i, e.target.value)}
                rows={2}
                className={`${fieldCls} resize-none flex-1`}
              />
              {(form.instructions?.length ?? 0) > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="text-error text-lg mt-1 cursor-pointer hover:opacity-70"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-sm pt-xs">
        <button
          type="submit"
          disabled={saving}
          className="px-md py-xs bg-terra-dark text-on-primary font-label-md rounded-lg hover:bg-primary cursor-pointer disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-md py-xs font-label-md text-deep-muted hover:text-deep cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminRecipes() {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState(searchParams.get('action') === 'new' ? 'new' : null); // 'new' | {recipe}
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    adminGetRecipes({ search, page })
      .then(({ data, meta: m }) => { setRecipes(data ?? []); setMeta(m); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, page]);

  const handleCreate = async (form) => {
    await adminCreateRecipe(form);
    setPanel(null);
    load();
  };

  const handleUpdate = async (form) => {
    await adminUpdateRecipe(panel.id, form);
    setPanel(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this recipe?')) return;
    setDeleting(id);
    try { await adminDeleteRecipe(id); load(); } catch {} finally { setDeleting(null); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-md">
        <h1 className="font-headline-lg text-deep">Recipes</h1>
        <button
          onClick={() => setPanel('new')}
          className="px-md py-xs bg-terra-dark text-on-primary font-label-md rounded-lg hover:bg-primary cursor-pointer"
        >
          + Add Recipe
        </button>
      </div>

      {panel && (
        <div className="bg-surface rounded-2xl border border-blush p-md mb-md">
          <h2 className="font-headline-md text-deep mb-sm">{panel === 'new' ? 'New Recipe' : `Edit: ${panel.title}`}</h2>
          <RecipeForm
            initial={panel !== 'new' ? panel : undefined}
            onSave={panel === 'new' ? handleCreate : handleUpdate}
            onCancel={() => setPanel(null)}
          />
        </div>
      )}

      <div className="mb-sm">
        <div className="relative w-full max-w-xs">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[18px] text-deep-muted pointer-events-none">search</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search recipes..."
            className="w-full bg-surface-container-low border border-blush rounded-xl pl-9 pr-sm py-2 font-body-sm text-deep focus:outline-none focus:border-terra-dark transition-colors"
          />
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-container-low border-b border-blush/30">
              <tr>
                <th className="text-left px-md py-sm font-label-md text-deep-muted uppercase tracking-wider">Recipe</th>
                <th className="text-left px-md py-sm font-label-md text-deep-muted uppercase tracking-wider hidden sm:table-cell">Cuisine</th>
                <th className="text-right px-md py-sm font-label-md text-deep-muted uppercase tracking-wider hidden md:table-cell">Views</th>
                <th className="text-right px-md py-sm font-label-md text-deep-muted uppercase tracking-wider hidden md:table-cell">Favs</th>
                <th className="px-md py-sm" />
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.id} className="border-b border-blush/20 last:border-0 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-md py-sm">
                    <div className="flex items-center gap-xs">
                      <span className="text-lg">{r.emoji}</span>
                      <span className="font-body-sm font-bold text-deep">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-md py-sm font-body-sm text-deep-muted hidden sm:table-cell">{toTitleCase(r.cuisine)}</td>
                  <td className="px-md py-sm text-right font-body-sm text-deep-muted hidden md:table-cell">{r.view_count}</td>
                  <td className="px-md py-sm text-right font-body-sm text-deep-muted hidden md:table-cell">{r.favorites_count}</td>
                  <td className="px-md py-sm">
                    <div className="flex items-center justify-end gap-sm">
                      <button
                        onClick={() => setPanel(r)}
                        className="font-label-md text-terra-dark hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        className="font-label-md text-error hover:underline cursor-pointer disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.last_page > 1 && (
            <div className="px-md py-sm flex items-center justify-between border-t border-blush/20">
              <span className="font-label-md text-deep-muted">Page {meta.current_page} of {meta.last_page}</span>
              <div className="flex gap-sm">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="font-label-md text-terra-dark hover:underline cursor-pointer disabled:opacity-40"
                >
                  ← Prev
                </button>
                <button
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="font-label-md text-terra-dark hover:underline cursor-pointer disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
