import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Footer() {
  const links = [
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
    { label: "Support", to: "/support" },
    { label: "About", to: "/about" },
  ];

  return (
    <footer className="bg-cream border-t border-blush/40 px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT — Brand */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
          }}
          className="font-display text-3xl font-bold tracking-wide text-deep"
        >
          TABERU
        </motion.h2>

        {/* CENTER — Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-8 text-sm text-deep-muted"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="transition-colors hover:text-terra"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* RIGHT — Copyright */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 280,
            damping: 24,
          }}
          className="text-sm text-deep-muted text-center md:text-right"
        >
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-deep">
            TABERU.
          </span>{" "}
          Crafted for the Modern Epicurean.
        </motion.p>
      </div>
    </footer>
  );
}

export default Footer;