import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function CTASection() {
  return (
    <section className="py-lg px-margin-mobile md:px-margin-desktop bg-surface-container text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blush/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary-container/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <h2 className="font-display-lg-mobile md:font-display-lg text-deep mb-md">
          Start your cooking journey today
        </h2>
        <p className="font-body-lg text-deep-muted mb-lg max-w-xl mx-auto">
          Join us and transform your everyday ingredients into extraordinary, authentic meals.
        </p>

        <motion.div
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          className="inline-block"
        >
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-lg py-sm bg-terra-dark text-on-primary font-label-lg rounded-lg hover-lift transition-colors hover:bg-primary shadow-lg"
          >
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
            Start Cooking
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default CTASection;
