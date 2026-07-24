import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetUsers, adminUpdateUserRole, adminDeleteUser } from '../../services/api';
import Loader from '../../components/Loader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    adminGetUsers({ search, page })
      .then(({ data, meta: m }) => { setUsers(data ?? []); setMeta(m); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, page]);

  const handleDelete = async (user) => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setDeletingId(user.id);
    try {
      await adminDeleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    setTogglingId(user.id);
    try {
      const updated = await adminUpdateUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: updated.role } : u)));
    } catch {
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-headline-lg text-deep mb-md">Users</h1>

      <div className="mb-sm">
        <div className="relative w-full max-w-xs">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[18px] text-deep-muted pointer-events-none">search</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full bg-surface-container-low border border-blush rounded-xl pl-9 pr-sm py-2 font-body-sm text-deep focus:outline-none focus:border-terra-dark transition-colors"
          />
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-container-low border-b border-blush/30">
              <tr>
                <th className="text-left px-md py-sm font-label-md text-deep-muted uppercase tracking-wider">User</th>
                <th className="text-right px-md py-sm font-label-md text-deep-muted uppercase tracking-wider hidden sm:table-cell">Favorites</th>
                <th className="text-right px-md py-sm font-label-md text-deep-muted uppercase tracking-wider hidden md:table-cell">Cooks</th>
                <th className="text-center px-md py-sm font-label-md text-deep-muted uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-blush/20 last:border-0 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-md py-sm">
                    <div className="font-body-sm font-bold text-deep leading-snug">{u.name}</div>
                    <div className="font-label-md text-deep-muted mt-1 leading-normal">{u.email}</div>
                    <div className="font-label-md text-deep-muted/60 mt-0.5 leading-normal">
                      Joined {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-md py-sm text-right font-body-sm text-deep-muted hidden sm:table-cell">{u.favorites_count}</td>
                  <td className="px-md py-sm text-right font-body-sm text-deep-muted hidden md:table-cell">{u.cook_logs_count}</td>
                  <td className="px-md py-sm text-center">
                    <div className="flex items-center justify-center gap-xs">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        disabled={togglingId === u.id}
                        className={`font-label-md px-2.5 py-1 rounded-full border transition-colors cursor-pointer disabled:opacity-60 ${
                          u.role === 'admin'
                            ? 'bg-primary-container/20 text-primary border-primary/20 hover:bg-primary-container/30'
                            : 'bg-sage/20 text-tertiary border-sage/30 hover:bg-sage/30'
                        }`}
                      >
                        {u.role === 'admin' ? 'Admin' : 'User'}
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u.id}
                        className="text-error hover:bg-error-container/20 rounded-full p-1 transition-colors cursor-pointer disabled:opacity-40"
                        title="Delete user"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
