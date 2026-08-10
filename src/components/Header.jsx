import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  fadeLeft,
  fadeRight,
  fadeUp,
  motionSafe,
  stagger,
  transitions,
} from "../motion/presets";

import {
  scrollToElementWhenReady,
  scrollToTop,
} from "../utils/scrollToSection";
import DownloadBrochureButton from "./DownloadBrochureButton";
import { usePublicBlogs } from "../hooks/usePublicBlogs";
import { areBlogsPubliclyVisible } from "../constants/blogs";

const NAV_ITEMS = [
  { label: "HOME", sectionId: "home" },
  { label: "PRODUCTS", path: "/products" },
  { label: "ABOUT US", sectionId: "about" },
  { label: "BLOGS", path: "/blogs", requiresBlogs: true },
  { label: "CONTACT US", sectionId: "contact" },
];

const NavLink = ({ label, isActive, onClick, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative cursor-pointer whitespace-nowrap border-0 bg-transparent pb-1 font-sans text-[11px] font-medium tracking-[0.15em] no-underline ${className} ${
        isActive ? "text-gold-400" : "text-cream-100/90"
      }`}
      variants={fadeUp}
      whileHover={
        prefersReducedMotion ? undefined : { color: "rgba(253, 252, 249, 1)" }
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={transitions.fast}
    >
      {label}

      {isActive && (
        <motion.span
          layoutId="header-nav-underline"
          className="absolute -bottom-0.5 left-0 h-px w-full bg-gold-400"
          transition={
            prefersReducedMotion
              ? transitions.instant
              : transitions.springSnappy
          }
        />
      )}
    </motion.button>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const [activeLink, setActiveLink] = useState("HOME");

  const prefersReducedMotion = useReducedMotion();

  const { blogs, loading: blogsLoading } = usePublicBlogs();
  const showBlogsNav = !blogsLoading && areBlogsPubliclyVisible(blogs);
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.requiresBlogs || showBlogsNav,
  );

  const closeMenu = () => setMenuOpen(false);

  const setActive = (label) => {
    setActiveLink(label);

    closeMenu();
  };

  const navigateToSection = (sectionId, label) => {
    setActive(label);

    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: `#${sectionId}` });

      return;
    }

    window.history.replaceState(null, "", `/#${sectionId}`);

    scrollToElementWhenReady(sectionId);
  };

  const navigateHome = () => {
    setActive("HOME");

    if (location.pathname !== "/") {
      navigate("/");

      return;
    }

    window.history.replaceState(null, "", "/");

    scrollToTop();
  };

  const navigateToEnquiry = () => {
    closeMenu();

    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: "#enquiry" });

      return;
    }

    window.history.replaceState(null, "", "/#enquiry");

    scrollToElementWhenReady("enquiry");
  };

  const handleNavClick = (item) => {
    if (item.sectionId === "home") {
      navigateHome();

      return;
    }

    if (item.path) {
      setActive(item.label);

      navigate(item.path);

      return;
    }

    navigateToSection(item.sectionId, item.label);
  };

  useEffect(() => {
    if (
      location.pathname === "/products" ||
      location.pathname.startsWith("/products/")
    ) {
      setActiveLink("PRODUCTS");

      return;
    }

    if (
      location.pathname === "/blogs" ||
      location.pathname.startsWith("/blogs/")
    ) {
      setActiveLink("BLOGS");

      return;
    }

    if (location.pathname !== "/") {
      return;
    }

    const hash = location.hash.replace("#", "");

    if (!hash) {
      setActiveLink("HOME");

      return;
    }

    const match = NAV_ITEMS.find((item) => item.sectionId === hash);

    if (match) {
      setActiveLink(match.label);
    }
  }, [location.pathname, location.hash]);

  const headerProps = motionSafe(prefersReducedMotion, {
    initial: { y: -20, opacity: 0 },

    animate: { y: 0, opacity: 1 },

    transition: { ...transitions.slow, delay: 0.05 },
  });

  const logoProps = motionSafe(prefersReducedMotion, {
    initial: "hidden",

    animate: "visible",

    variants: fadeLeft,

    transition: { ...transitions.base, delay: 0.12 },

    whileHover: { scale: 1.02 },

    whileTap: { scale: 0.98 },
  });

  const ctaProps = motionSafe(prefersReducedMotion, {
    initial: "hidden",

    animate: "visible",

    variants: fadeRight,

    transition: { ...transitions.base, delay: 0.35 },

    whileHover: { scale: 1.03, backgroundColor: "#e5a647" },

    whileTap: { scale: 0.97 },
  });

  return (
    <motion.header
      className="sticky top-0 z-50 bg-header shadow-lg shadow-black/30"
      {...headerProps}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4 py-3 xl:grid-cols-[1fr_auto_1fr] xl:py-4">
          {/* Logo */}

          <motion.button
            type="button"
            className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-0 no-underline xl:justify-self-start"
            onClick={navigateHome}
            aria-label="Aira Crest — Home"
            {...logoProps}
          >
            <img
              src="/fulllogonew.webp"
              alt="Aira Crest"
              className="h-[96px] w-auto object-contain sm:h-[110px] lg:h-[124px]"
            />
          </motion.button>

          {/* Desktop navigation — centered */}

          <motion.nav
            className="hidden items-center justify-center gap-8 xl:flex xl:gap-10"
            aria-label="Main navigation"
            initial="hidden"
            animate="visible"
            variants={prefersReducedMotion ? undefined : stagger(0.05, 0.2)}
          >
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.label}
                label={item.label}
                isActive={activeLink === item.label}
                onClick={() => handleNavClick(item)}
              />
            ))}
          </motion.nav>

          {/* CTA + mobile toggle */}

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3 xl:justify-self-end">
            <DownloadBrochureButton variant="headerMobile" />

            <DownloadBrochureButton variant="headerDesktop" />

            <motion.button
              type="button"
              className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-gold-500 px-2.5 py-2 font-sans text-[9px] font-bold tracking-[0.12em] text-maroon-950 no-underline xl:hidden sm:px-3 sm:py-2.5 sm:text-[10px] sm:tracking-[0.14em]"
              onClick={navigateToEnquiry}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { backgroundColor: "#e5a647" }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              transition={transitions.fast}
            >
              <span className="max-[380px]:hidden">REQUEST A QUOTE</span>

              <span className="hidden max-[380px]:inline">ENQUIRY</span>
            </motion.button>

            <motion.button
              type="button"
              className="hidden shrink-0 cursor-pointer rounded-sm border-0 bg-gold-500 px-5 py-2.5 font-sans text-[11px] font-bold tracking-[0.18em] text-maroon-950 no-underline xl:inline-flex"
              onClick={navigateToEnquiry}
              {...ctaProps}
            >
              REQUEST A QUOTE
            </motion.button>

            <motion.button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-cream-100/20 text-cream-100 xl:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { borderColor: "rgba(212, 175, 55, 0.5)", color: "#e5a647" }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              transition={transitions.fast}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{
                    opacity: 0,
                    rotate: prefersReducedMotion ? 0 : -90,
                  }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: prefersReducedMotion ? 0 : 90 }}
                  transition={transitions.fast}
                  className="inline-flex"
                >
                  {menuOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}

      <motion.div
        className={`grid overflow-hidden xl:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        initial={false}
        animate={{ gridTemplateRows: menuOpen ? "1fr" : "0fr" }}
        transition={
          prefersReducedMotion ? transitions.instant : transitions.base
        }
        aria-hidden={!menuOpen}
      >
        <div className="overflow-hidden border-t border-cream-100/10">
          <motion.nav
            className="mx-auto flex max-w-[1440px] flex-col px-4 py-4 sm:px-6"
            aria-label="Mobile navigation"
            initial={false}
            animate={menuOpen ? "visible" : "hidden"}
            variants={prefersReducedMotion ? fadeUp : stagger(0.05, 0.04)}
          >
            {visibleNavItems.map((item) => {
              const isActive = activeLink === item.label;

              return (
                <motion.button
                  key={item.label}
                  type="button"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => handleNavClick(item)}
                  variants={fadeUp}
                  className={`cursor-pointer border-0 border-b border-cream-100/5 bg-transparent py-3 text-left font-sans text-xs font-medium tracking-[0.15em] no-underline ${
                    isActive ? "text-gold-400" : "text-cream-100/90"
                  }`}
                  whileTap={prefersReducedMotion ? undefined : { x: 4 }}
                  transition={transitions.fast}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </motion.nav>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
