import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B3E2F&color=fff`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, ask the server who is logged in (uses httpOnly cookie automatically).
  // If the cookie is absent or expired the server returns 401 → user stays null.
  useEffect(() => {
    authService.me()
      .then((u) => setUser({ ...u, avatar: avatarUrl(u.name) }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser({ ...userData, avatar: avatarUrl(userData.name) });
  };

  const logout = () => {
    setUser(null);
    // Fire-and-forget: clear the cookie server-side; UI already reflects logged-out state.
    authService.logout().catch(() => {});
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
