import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps any route that requires authentication.
 *
 * Behaviour:
 *   - While AuthContext is still reading localStorage → render nothing (avoids flash redirect)
 *   - Authenticated → render children as-is
 *   - Not authenticated → redirect to /login (replace so back button doesn't loop)
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
