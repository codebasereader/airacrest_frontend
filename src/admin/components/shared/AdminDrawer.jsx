import React, { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { lockBodyScroll } from "../../utils/bodyScrollLock";

const DRAWER_WIDTH = {
  md: "max-w-md",
  lg: "max-w-xl",
  xl: "max-w-3xl",
};

const AdminDrawer = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    return lockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="admin-drawer"
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 cursor-pointer bg-maroon-950/45 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.aside
            className={`absolute top-0 right-0 flex h-full w-full ${DRAWER_WIDTH[size] || DRAWER_WIDTH.md} flex-col border-l border-maroon-200/60 bg-cream-50 shadow-[-12px_0_40px_-12px_rgba(61,12,17,0.25)]`}
            initial={prefersReducedMotion ? false : { x: "100%" }}
            animate={prefersReducedMotion ? undefined : { x: 0 }}
            exit={prefersReducedMotion ? undefined : { x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-maroon-200/50 bg-white px-5 py-4">
              <div className="min-w-0">
                <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-gold-600 uppercase">
                  Catalogue
                </p>
                <h2 className="mt-1 font-heading text-lg font-bold tracking-[0.06em] text-maroon-900">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 font-sans text-xs leading-relaxed text-maroon-600">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-maroon-200/70 bg-cream-50 text-maroon-700 transition-colors hover:border-maroon-400 hover:text-maroon-900"
                aria-label="Close"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1.75}
                />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminDrawer;
