import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import UserProfileMenu from "./UserProfileMenu";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { favoritesCount } = useFavorites();
  const { isAuthenticated, logout } = useAuth();

  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path;

  const navLinks = [
    {
      to: "/home",
      label: "Home",
      id: "nav-home",
      show: true,
    },
    {
      to: "/planner",
      label: "Planner",
      id: "nav-planner",
      show: isAuthenticated,
    },
  ];

  const visibleLinks =
    navLinks.filter((l) => l.show);

  return (
    <nav
      className="sticky top-0 z-50 bg-rosewood-700 shadow-sm border-b border-blush/20"
      id="navbar"
    >
      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-6 md:px-10 lg:px-14 xl:px-16">
        <div className="relative h-16 flex items-center w-full">

          {/* LEFT — BRAND */}
          <div className="absolute left-0 flex items-center z-20">
            <Link
              to="/"
              className="group"
            >
              <span className="font-display font-bold text-[1.6rem] tracking-wide uppercase text-on-primary transition-opacity group-hover:opacity-90">
                TABERU
              </span>
            </Link>
          </div>

          {/* CENTER — DESKTOP NAV */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            {visibleLinks.map(
              (link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  id={link.id}
                  className={`relative font-label-lg transition-all duration-300 ${
                    isActive(
                      link.to
                    )
                      ? "font-semibold text-on-primary"
                      : "text-on-primary/75 hover:text-on-primary"
                  }`}
                >
                  {link.label}

                  {isActive(
                    link.to
                  ) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-terra"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            )}

            {/* Favorites */}
            <Link
              to="/favorites"
              id="nav-favorites"
              className={`relative flex items-center gap-1.5 font-label-lg transition-all duration-300 ${
                isActive(
                  "/favorites"
                )
                  ? "font-semibold text-on-primary"
                  : "text-on-primary/75 hover:text-on-primary"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings:
                    "'FILL' 1",
                }}
              >
                favorite
              </span>

              Favorites

              <AnimatePresence>
                {favoritesCount >
                  0 && (
                  <motion.span
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    exit={{
                      scale: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 22,
                    }}
                    className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-terra text-white rounded-full"
                  >
                    {
                      favoritesCount
                    }
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive(
                "/favorites"
              ) && (
                <motion.span
                  layoutId="navbar-indicator"
                  className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-terra"
                />
              )}
            </Link>
          </div>

          {/* RIGHT — PROFILE / AUTH */}
          <div className="hidden md:flex absolute right-0 items-center z-20">
            {isAuthenticated ? (
              <UserProfileMenu />
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="font-label-lg text-on-primary/80 hover:text-on-primary transition-colors"
                >
                  Log in
                </Link>

                <motion.div
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Link
                    to="/signup"
                    className="font-label-lg bg-terra text-white px-5 py-2.5 rounded-xl hover:bg-terra-dark transition-colors"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            onClick={() =>
              setIsMenuOpen(
                !isMenuOpen
              )
            }
            whileTap={{
              scale: 0.88,
            }}
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-terra-dark/40 transition-colors cursor-pointer"
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
              <motion.span
                animate={
                  isMenuOpen
                    ? {
                        rotate: 45,
                        y: 6,
                      }
                    : {
                        rotate: 0,
                        y: 0,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 30,
                }}
                className="block w-5 h-0.5 bg-on-primary origin-center"
              />

              <motion.span
                animate={
                  isMenuOpen
                    ? {
                        opacity: 0,
                        scaleX: 0,
                      }
                    : {
                        opacity: 1,
                        scaleX: 1,
                      }
                }
                transition={{
                  duration: 0.15,
                }}
                className="block w-5 h-0.5 bg-on-primary"
              />

              <motion.span
                animate={
                  isMenuOpen
                    ? {
                        rotate: -45,
                        y: -6,
                      }
                    : {
                        rotate: 0,
                        y: 0,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 30,
                }}
                className="block w-5 h-0.5 bg-on-primary origin-center"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 34,
            }}
            className="md:hidden overflow-hidden border-t border-blush/20 bg-rosewood-800/95 backdrop-blur-sm"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {visibleLinks.map(
                (link, i) => (
                  <motion.div
                    key={
                      link.to
                    }
                    initial={{
                      x: -14,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    transition={{
                      delay:
                        i *
                        0.05,
                      type: "spring",
                      stiffness: 340,
                      damping: 28,
                    }}
                  >
                    <Link
                      to={
                        link.to
                      }
                      onClick={() =>
                        setIsMenuOpen(
                          false
                        )
                      }
                      className={`block font-label-lg py-2.5 px-2 rounded-lg transition-colors ${
                        isActive(
                          link.to
                        )
                          ? "text-on-primary bg-terra-dark/50"
                          : "text-on-primary/80 hover:text-on-primary"
                      }`}
                    >
                      {
                        link.label
                      }
                    </Link>
                  </motion.div>
                )
              )}

              <div className="border-t border-blush/20 mt-2 pt-3 flex flex-col gap-1">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(
                        false
                      );
                    }}
                    className="text-left text-on-primary/80 py-2.5 px-2 rounded-lg font-label-lg hover:text-on-primary transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() =>
                        setIsMenuOpen(
                          false
                        )
                      }
                      className="block text-on-primary/80 font-label-lg py-2.5 px-2 rounded-lg hover:text-on-primary transition-colors"
                    >
                      Log in
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() =>
                        setIsMenuOpen(
                          false
                        )
                      }
                      className="block bg-terra text-on-primary text-center font-label-lg py-2.5 rounded-xl hover:bg-terra-dark transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;