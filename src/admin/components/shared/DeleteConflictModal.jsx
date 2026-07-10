import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { lockBodyScroll } from "../../utils/bodyScrollLock";

const LinkedItemList = ({ title, items }) => {
  if (!items?.length) return null;

  return (
    <div>
      <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-600 uppercase">
        {title}
      </p>
      <ul className="mt-2 max-h-36 space-y-1.5 overflow-y-auto rounded-lg border border-maroon-100 bg-white px-3 py-2.5">
        {items.map((item) => (
          <li
            key={item._id}
            className="font-sans text-sm text-maroon-900"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DeleteConflictModal = ({
  open,
  onClose,
  title,
  message,
  conflict,
  type = "category",
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

  const subcategories = conflict?.subcategories ?? [];
  const products = conflict?.products ?? [];
  const subcategoryCount = conflict?.subcategoryCount ?? subcategories.length;
  const productCount = conflict?.productCount ?? products.length;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="delete-conflict-modal"
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-conflict-title"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 cursor-pointer bg-maroon-950/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-maroon-200/60 bg-cream-50 shadow-[0_24px_64px_-16px_rgba(61,12,17,0.35)]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-maroon-200/50 bg-white px-5 py-4">
              <div className="min-w-0">
                <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-gold-600 uppercase">
                  Cannot delete
                </p>
                <h2
                  id="delete-conflict-title"
                  className="mt-1 font-heading text-lg font-bold tracking-[0.06em] text-maroon-900"
                >
                  {title}
                </h2>
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

            <div className="space-y-5 overflow-y-auto px-5 py-5">
              <p className="font-sans text-sm leading-relaxed text-maroon-800">
                {message}
              </p>

              {(subcategoryCount > 0 || productCount > 0) && (
                <div className="rounded-xl border border-maroon-100 bg-maroon-50/40 px-4 py-3">
                  <p className="font-sans text-xs text-maroon-700">
                    {type === "category" ? (
                      <>
                        <span className="font-semibold text-maroon-900">
                          {subcategoryCount}
                        </span>{" "}
                        subcategor{subcategoryCount === 1 ? "y" : "ies"} and{" "}
                        <span className="font-semibold text-maroon-900">
                          {productCount}
                        </span>{" "}
                        product{productCount === 1 ? "" : "s"} linked
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-maroon-900">
                          {productCount}
                        </span>{" "}
                        product{productCount === 1 ? "" : "s"} mapped to this
                        subcategory
                      </>
                    )}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {type === "category" && (
                  <LinkedItemList
                    title={`Linked subcategories (${subcategories.length})`}
                    items={subcategories}
                  />
                )}
                <LinkedItemList
                  title={`Linked products (${products.length})`}
                  items={products}
                />
              </div>

              <p className="font-sans text-xs leading-relaxed text-maroon-600">
                {type === "category"
                  ? "Delete or reassign linked subcategories and products first, then try again."
                  : "Delete or reassign linked products first, then try again."}
              </p>
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-maroon-200/50 bg-white px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-maroon-200 bg-white px-5 py-2.5 font-sans text-[11px] font-semibold tracking-[0.12em] text-maroon-800 transition-colors hover:border-maroon-400 hover:bg-cream-50"
              >
                CLOSE
              </button>
              {productCount > 0 && (
                <Link
                  to="/admin/products"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-sm bg-gold-500 px-5 py-2.5 font-sans text-[11px] font-bold tracking-[0.12em] text-maroon-950 no-underline transition-colors hover:bg-gold-400"
                >
                  GO TO PRODUCTS
                </Link>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default DeleteConflictModal;
