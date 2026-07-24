import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { CollectionsProvider } from './context/CollectionsContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CollectionPrompt from './components/CollectionPrompt';
import FloatingAmbient from './components/FloatingAmbient';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import MealPlannerPage from './pages/MealPlannerPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRecipes from './pages/admin/AdminRecipes';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public routes */}
        <Route path="/" element={
          <PageWrapper><LandingPage /></PageWrapper>
        } />
        <Route path="/login" element={
          <PageWrapper><LoginPage /></PageWrapper>
        } />
        <Route path="/signup" element={
          <PageWrapper><SignupPage /></PageWrapper>
        } />

        {/* App routes */}
        <Route path="/home" element={
          <PageWrapper>
            <>
              <Navbar />
              <Home />
            </>
          </PageWrapper>
        } />

        <Route path="/favorites" element={
          <ProtectedRoute>
            <PageWrapper>
              <>
                <Navbar />
                <FavoritesPage />
              </>
            </PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <PageWrapper>
              <>
                <Navbar />
                <ProfilePage />
              </>
            </PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/planner" element={
          <ProtectedRoute>
            <PageWrapper>
              <>
                <Navbar />
                <MealPlannerPage />
              </>
            </PageWrapper>
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <PageWrapper><AdminDashboard /></PageWrapper>
          </AdminRoute>
        } />
        <Route path="/admin/recipes" element={
          <AdminRoute>
            <PageWrapper><AdminRecipes /></PageWrapper>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <PageWrapper><AdminUsers /></PageWrapper>
          </AdminRoute>
        } />
        <Route path="/admin/analytics" element={
          <AdminRoute>
            <PageWrapper><AdminAnalytics /></PageWrapper>
          </AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <PageWrapper><NotFoundPage /></PageWrapper>
        } />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <CollectionsProvider>
            <ErrorBoundary>
              <div className="min-h-screen bg-cream relative">
                <FloatingAmbient />
                <AnimatedRoutes />
                <CollectionPrompt />
              </div>
            </ErrorBoundary>
          </CollectionsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
