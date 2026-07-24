import { motion } from 'framer-motion';

function RatingStars({ rating = 0, reviewCount = 0, compact = false }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push('full');
    else if (rating >= i - 0.5) stars.push('half');
    else stars.push('empty');
  }

  return (
    <div className={`flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-0.5">
        {stars.map((state, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 18,
              delay: i * 0.06,
            }}
            className={`${
              state === 'full'
                ? 'text-gold'
                : state === 'half'
                ? 'text-gold/70'
                : 'text-blush-dark/40'
            } ${compact ? 'text-xs' : 'text-base'} drop-shadow-sm`}
          >
            ★
          </motion.span>
        ))}
      </div>

      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>

      {reviewCount > 0 && (
        <span className="text-deep-muted">
          ({reviewCount}{compact ? '' : ' reviews'})
        </span>
      )}
    </div>
  );
}

export default RatingStars;
