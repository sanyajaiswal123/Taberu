import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin',           label: 'Dashboard', icon: 'dashboard',  end: true },
  { to: '/admin/recipes',   label: 'Recipes',   icon: 'menu_book' },
  { to: '/admin/users',     label: 'Users',     icon: 'group' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'monitoring' },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-inverse-surface text-inverse-on-surface flex flex-col flex-shrink-0">
        <div className="px-md py-md border-b border-on-surface/10">
          <div className="font-body-lg font-bold tracking-wider uppercase text-inverse-on-surface">Taberu</div>
          <div className="font-label-md text-inverse-on-surface/50 mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 py-sm space-y-0.5">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-sm px-md py-2.5 font-label-lg transition-colors ${
                  isActive
                    ? 'bg-on-surface/10 text-inverse-on-surface font-bold border-l-[3px] border-primary-container'
                    : 'text-inverse-on-surface/60 hover:text-inverse-on-surface hover:bg-white/5'
                }`
              }
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-md py-md border-t border-on-surface/10 space-y-1">
          <button
            onClick={() => navigate('/home')}
            className="w-full text-left flex items-center gap-xs font-label-md text-inverse-on-surface/50 hover:text-inverse-on-surface/90 transition-colors py-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to App
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full text-left flex items-center gap-xs font-label-md text-inverse-on-surface/50 hover:text-inverse-on-surface/90 transition-colors py-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-background overflow-y-auto">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
