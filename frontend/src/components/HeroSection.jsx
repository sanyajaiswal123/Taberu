import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen pt-20 flex items-center bg-gradient-to-b from-blush-light/50 to-background overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-32 right-20 w-64 h-64 bg-blush/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-surface-container/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-margin-mobile md:px-margin-desktop py-lg relative z-10">

        {/* Left content */}
        <div className="flex flex-col items-start text-left max-w-xl">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.1 }}
            className="inline-block px-3 py-1 bg-surface-container-high border border-blush rounded-full font-label-md text-deep-muted mb-md"
          >
            Enjoy Authentic Taste
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.18 }}
            className="font-display-lg-mobile md:font-display-lg text-deep mb-lg w-full"
          >
            Cook Smart with{' '}
            <span className="text-primary italic">What You Have</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.26 }}
            className="font-body-lg text-deep-muted mb-lg w-full max-w-md"
          >
            Turn your ingredients into delicious recipes instantly. A calm, premium culinary experience tailored just for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.34 }}
          >
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-md py-sm bg-terra-dark text-on-primary font-label-lg rounded-lg hover-lift transition-colors hover:bg-primary"
            >
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
              Start Cooking
            </Link>
          </motion.div>
        </div>

        {/* Right — food image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-0 bg-blush/20 rounded-full blur-3xl scale-75 opacity-60 pointer-events-none" />

          <motion.img
            src="/hero_ramen_bowl.png"
            alt="Delicious Japanese Ramen"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.2 }}
            className="relative z-10 w-full max-w-lg object-contain drop-shadow-2xl"
            style={{ animation: 'heroFloat 6s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="heroFloat"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
