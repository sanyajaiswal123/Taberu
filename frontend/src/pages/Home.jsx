import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IngredientInput from '../components/IngredientInput';
import SearchSection from '../components/SearchSection';
import MultiFilter from '../components/MultiFilter';
import RecipeList from '../components/RecipeList';
import RecipeDetails from '../components/RecipeDetails';
import RecentlyViewed from '../components/RecentlyViewed';
import TrendingCard from '../components/TrendingCard';
import Footer from '../components/Footer';
import { getAllRecipes, getPopularRecipes } from '../services/api';
import { isVegetarian } from '../utils/recipeHelpers';

function Home() {
  // ── Data ─────────────────────────────────────────────────────────────────
  const [recipes, setRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [ingredientResetKey, setIngredientResetKey] = useState(0);
  const [searchResetKey, setSearchResetKey] = useState(0);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [ingredientList, setIngredientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allData, popData] = await Promise.all([
        getAllRecipes(),
        getPopularRecipes(6),
      ]);
      setRecipes(allData);
      setPopularRecipes(popData);
    } catch {
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleIngredientChange = useCallback((ingredients) => {
    setIngredientList(ingredients);
  }, []);

  const handleIngredientSearch = useCallback(() => {
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleRecipeClick = useCallback((recipe) => setSelectedRecipe(recipe), []);

  const handleCloseDetails = useCallback(() => {
    setSelectedRecipe(null);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleClearAll = () => {
    setIngredientList([]);
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedCuisines([]);
    setSelectedDiets([]);
    setIngredientResetKey((k) => k + 1);
    setSearchResetKey((k) => k + 1);
  };

  // ── Combined filtering (memoized) ─────────────────────────────────────────
  const filteredRecipes = useMemo(() => {
    return recipes
      .map((recipe) => {
        let matchCount = 0;
        if (ingredientList.length > 0) {
          const recipeIngredients = (recipe.ingredients ?? []).map((i) =>
            (typeof i === 'string' ? i : i.name).toLowerCase()
          );
          matchCount = ingredientList.filter((input) =>
            recipeIngredients.some((ri) => ri.includes(input) || input.includes(ri))
          ).length;
        }
        return { ...recipe, matchCount };
      })
      .filter((recipe) => {
        if (ingredientList.length > 0 && recipe.matchCount === 0) return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const inTitle = recipe.title.toLowerCase().includes(q);
          const inIngredients = (recipe.ingredients ?? []).some((i) =>
            (typeof i === 'string' ? i : i.name).toLowerCase().includes(q)
          );
          if (!inTitle && !inIngredients) return false;
        }

        if (selectedCategories.length > 0 && !selectedCategories.includes(recipe.category)) return false;
        if (selectedCuisines.length > 0 && !selectedCuisines.includes(recipe.cuisine)) return false;

        if (selectedDiets.length > 0) {
          const isVeg = isVegetarian(recipe);
          if (selectedDiets.includes('veg') && !selectedDiets.includes('non-veg') && !isVeg) return false;
          if (selectedDiets.includes('non-veg') && !selectedDiets.includes('veg') && isVeg) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (ingredientList.length > 0) return b.matchCount - a.matchCount;
        return 0;
      });
  }, [recipes, ingredientList, searchQuery, selectedCategories, selectedCuisines, selectedDiets]);

  const hasActiveFilters =
    ingredientList.length > 0 ||
    searchQuery !== '' ||
    selectedCategories.length > 0 ||
    selectedCuisines.length > 0 ||
    selectedDiets.length > 0;

  const activeFilterCount = [
    ingredientList.length > 0,
    searchQuery !== '',
    selectedCategories.length > 0,
    selectedCuisines.length > 0,
    selectedDiets.length > 0,
  ].filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="flex-1 bg-background">

      {/* ── Hero: ingredient search + text search ── */}
      <section className="relative py-lg px-margin-mobile md:px-margin-desktop overflow-hidden bg-gradient-to-b from-blush-light/50 to-background">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blush/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-surface-container/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.1 }}
            className="inline-block px-3 py-1 bg-surface-container-high border border-blush rounded-full font-label-md text-deep-muted mb-md"
          >
            Discover Perfect Recipes
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.18 }}
            className="font-display-lg-mobile md:font-display-lg text-deep mb-md"
          >
            What ingredients{' '}
            <span className="text-primary italic">do you have?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.26 }}
            className="font-body-lg text-deep-muted mb-lg max-w-xl mx-auto"
          >
            Add your ingredients and we'll find the best matching recipes instantly.
          </motion.p>

          {/* Primary search: ingredient chips */}
          <IngredientInput
            key={ingredientResetKey}
            onChange={handleIngredientChange}
            onSearch={handleIngredientSearch}
          />

          {/* Secondary search: free-text recipe name */}
          <div className="mt-sm">
            <SearchSection onSearch={handleSearch} resetKey={searchResetKey} />
          </div>
        </div>
      </section>

      {/* ── Trending Now ── */}
      {!hasActiveFilters && popularRecipes.length > 0 && (
        <section className="py-lg px-margin-mobile md:px-margin-desktop overflow-hidden max-w-[1440px] mx-auto" id="popular-recipes">
          <h2 className="font-headline-lg text-deep mb-md flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[28px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            Trending Now
          </h2>
          <div className="flex gap-md overflow-x-auto hide-scrollbar pb-sm snap-x snap-mandatory">
            {popularRecipes.map((recipe) => (
              <TrendingCard key={recipe.id} recipe={recipe} onClick={handleRecipeClick} />
            ))}
          </div>
        </section>
      )}

      {/* ── Results & Filtering ── */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg" id="results-section">

        <MultiFilter
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          selectedCuisines={selectedCuisines}
          onCuisineChange={setSelectedCuisines}
          selectedDiets={selectedDiets}
          onDietChange={setSelectedDiets}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-md">
          <div>
            <h2 className="font-headline-lg text-deep">
              {hasActiveFilters ? 'Search Results' : 'All Recipes'}
            </h2>

            {ingredientList.length > 0 && (
              <p className="font-body-sm text-deep-muted mt-1">
                Showing recipes using:{' '}
                {ingredientList.map((ing, i) => (
                  <span key={ing}>
                    <span className="font-semibold text-primary">
                      {ing.charAt(0).toUpperCase() + ing.slice(1)}
                    </span>
                    {i < ingredientList.length - 1 && (
                      <span className="mx-1.5 text-deep-muted/40">·</span>
                    )}
                  </span>
                ))}
              </p>
            )}

            {activeFilterCount >= 2 && (
              <p className="font-body-sm text-deep-muted/60 mt-0.5 italic">
                All filters apply together
              </p>
            )}
          </div>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                onClick={handleClearAll}
                className="font-label-md text-deep-muted hover:text-terra-dark transition-colors cursor-pointer border border-blush/50 px-4 py-2 rounded-full hover:bg-blush-light whitespace-nowrap"
                aria-label="Clear all active filters"
              >
                Clear All Filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <RecipeList
          recipes={filteredRecipes}
          loading={loading}
          error={error}
          onRecipeClick={handleRecipeClick}
          onRetry={loadData}
        />
      </section>

      {/* ── Recently Viewed ── */}
      <RecentlyViewed key={refreshKey} onRecipeClick={handleRecipeClick} />

      {/* ── Footer ── */}
      <Footer />

      {/* ── Recipe Details Modal ── */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetails recipe={selectedRecipe} onClose={handleCloseDetails} />
        )}
      </AnimatePresence>

    </main>
  );
}

export default Home;
