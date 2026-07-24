import { motion } from 'framer-motion';

function SkeletonCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-surface/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-blush/30"
    >
      <div className="h-44 bg-gradient-to-br from-blush-light to-blush relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
      <div className="p-md space-y-sm">
        <div className="h-5 bg-blush/40 rounded-full w-3/4 skeleton-shimmer" />
        <div className="flex gap-xs">
          <div className="h-3 bg-blush/30 rounded-full w-16" />
          <div className="h-3 bg-blush/30 rounded-full w-20" />
        </div>
        <div className="flex gap-xs pt-1">
          <div className="h-6 bg-blush-light rounded-full w-16" />
          <div className="h-6 bg-blush-light rounded-full w-14" />
        </div>
      </div>
    </motion.div>
  );
}

function ThreeDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function Loader() {
  return (
    <div className="py-md" id="loader">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-sm mt-lg">
        <ThreeDots />
        <p className="font-body-sm text-deep-muted">Finding delicious recipes</p>
      </div>
    </div>
  );
}

export default Loader;
