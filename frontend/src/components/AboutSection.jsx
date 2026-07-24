import { motion } from 'framer-motion';

function AboutSection() {
  return (
    <section id="about" className="py-lg px-margin-mobile md:px-margin-desktop bg-surface-container-low relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

        {/* Left — Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          className="w-full md:w-1/2 relative"
        >
          <div className="aspect-square overflow-hidden rounded-2xl shadow-xl border border-blush">
            <motion.img
              src="/about_sushi.png"
              alt="Authentic Japanese Sushi"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Right — Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 240, damping: 28, delay: 0.1 }}
          className="w-full md:w-1/2 flex flex-col items-start text-left"
        >
          <span className="font-label-md text-deep-muted uppercase tracking-wider mb-sm inline-block px-3 py-1 bg-surface-container-high border border-blush rounded-full">
            About Us
          </span>
          <h2 className="font-headline-lg text-deep mb-md leading-tight w-full">
            We serve authentic{' '}
            <span className="text-primary italic">Japanese taste</span> to you
          </h2>
          <p className="font-body-md text-deep-muted mb-lg leading-relaxed w-full">
            We have been running for ten years to continue serving Japanese food, with authentic flavors that we will continue to nurture for you. Let our recipes bring the joy of cooking straight to your home.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
