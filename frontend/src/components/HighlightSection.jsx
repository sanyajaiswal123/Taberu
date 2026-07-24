import { motion } from 'framer-motion';

function HighlightSection() {
  return (
    <section className="py-lg px-margin-mobile md:px-margin-desktop bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          className="flex flex-col items-start order-2 md:order-1"
        >
          <span className="font-label-md text-deep-muted uppercase tracking-wider mb-sm inline-block px-3 py-1 bg-surface-container-high border border-blush rounded-full">
            Newly Added
          </span>
          <h2 className="font-headline-lg text-deep mb-md leading-tight w-full">
            Discover Recipes{' '}
            <br className="hidden md:block" />
            <span className="text-primary italic">Made Just for You</span>
          </h2>
          <p className="font-body-md text-deep-muted mb-lg w-full max-w-md">
            Experience the harmony of Japanese culinary traditions. We provide curated, high-quality recipes that match your ingredients and your taste buds.
          </p>
          <motion.a
            href="#menu"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-md py-sm bg-terra-dark text-on-primary font-label-lg rounded-lg hover-lift transition-colors hover:bg-primary"
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            Explore Features
          </motion.a>
        </motion.div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 240, damping: 28, delay: 0.1 }}
          className="relative order-1 md:order-2 flex justify-center"
        >
          <div className="absolute inset-0 bg-blush/20 rounded-3xl scale-95 blur-2xl" />
          <motion.img
            src="/highlight_bento.png"
            alt="Japanese Bento"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl object-cover border border-blush"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HighlightSection;
