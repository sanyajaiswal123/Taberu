import { motion } from 'framer-motion';

const features = [
  {
    icon: 'eco',
    title: 'Input Ingredients',
    desc: 'Got some fresh produce? Simply tell us what you have on hand.',
  },
  {
    icon: 'ramen_dining',
    title: 'Get Recipes',
    desc: 'Discover authentic dishes tailored precisely to your ingredients.',
  },
  {
    icon: 'favorite',
    title: 'Save Favorites',
    desc: 'Curate your own personal menu by saving the meals you love.',
  },
];

function FeaturesSection() {
  return (
    <section id="menu" className="py-lg px-margin-mobile md:px-margin-desktop bg-surface-container-low overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="font-headline-lg text-deep mb-lg"
        >
          Our Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 26, delay: i * 0.1 }}
              className="bg-surface border border-blush rounded-2xl p-md hover-lift flex flex-col items-center cursor-default"
            >
              <div className="w-16 h-16 bg-blush-light rounded-full flex items-center justify-center mb-md border border-blush">
                <span
                  className="material-symbols-outlined text-[32px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {f.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-deep mb-sm">{f.title}</h3>
              <p className="font-body-md text-deep-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
