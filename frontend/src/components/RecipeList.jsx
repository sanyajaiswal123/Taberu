import { motion } from 'framer-motion';
import RecipeImageCard from './RecipeImageCard';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 26 },
  },
};

function RecipeList({ recipes, loading, error, onRecipeClick, onRetry }) {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon="restaurant"
        title="No recipes found"
        message="Try different ingredients or fewer filters."
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  return (
    <div id="recipe-list">
      <p className="font-body-sm text-deep-muted mb-md">
        Showing <span className="font-semibold text-deep">{recipes.length}</span> recipe{recipes.length !== 1 ? 's' : ''}
      </p>
      <motion.div
        variants={gridContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md"
      >
        {recipes.map((recipe) => (
          <motion.div key={recipe.id} variants={gridItem} className="flex">
            <RecipeImageCard recipe={recipe} onClick={onRecipeClick} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default RecipeList;
