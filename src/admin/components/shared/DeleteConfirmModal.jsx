import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { lockBodyScroll } from "../../utils/bodyScrollLock";
import { adminDangerButtonClass, adminSecondaryButtonClass } from "../../constants/formStyles";

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  itemName,
  message,
  confirmMessage,
  deleting = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    return lockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !deleting) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, deleting]);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    onConfirm?.();
  };

  const stepOneMessage =
    message ||
    `Are you sure you want to delete "${itemName}"? This action may affect linked catalogue items.`;

  const stepTwoMessage =
    confirmMessage ||
    `This will permanently delete "${itemName}". This cannot be undone. Please confirm one more time to proceed.`;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="delete-confirm-modal"
          className="fixed inset-0 z-70 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            disabled={deleting}
            className="absolute inset-0 cursor-pointer bg-maroon-950/50 backdrop-blur-[2px] disabled:cursor-not-allowed"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-maroon-200/60 bg-cream-50 shadow-[0_24px_64px_-16px_rgba(61,12,17,0.35)]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-maroon-200/50 bg-white px-5 py-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon-100 text-maroon-800">
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    size={20}
                    color="currentColor"
                    strokeWidth={1.75}
                  />
                </span>
                <div className="min-w-0">
                  <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-gold-600 uppercase">
                    {step === 1 ? "Confirm deletion" : "Final confirmation"}
                  </p>
                  <h2
                    id="delete-confirm-title"
                    className="mt-1 font-heading text-lg font-bold tracking-[0.06em] text-maroon-900"
                  >
                    Delete {itemName}?
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={deleting}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-maroon-200/70 bg-cream-50 text-maroon-700 transition-colors hover:border-maroon-400 hover:text-maroon-900 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="space-y-4 px-5 py-5">
              <p className="font-sans text-sm leading-relaxed text-maroon-800">
                {step === 1 ? stepOneMessage : stepTwoMessage}
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step >= 1 ? "bg-maroon-700" : "bg-maroon-200"
                  }`}
                />
                <span
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step >= 2 ? "bg-maroon-700" : "bg-maroon-200"
                  }`}
                />
              </div>
              <p className="font-sans text-[10px] tracking-wide text-maroon-500 uppercase">
                Step {step} of 2
              </p>
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-maroon-200/50 bg-white px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={deleting}
                className={adminSecondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={deleting}
                className={
                  step === 1
                    ? "inline-flex cursor-pointer items-center justify-center rounded-sm border border-maroon-300/60 bg-maroon-800 px-4 py-2.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-cream-50 uppercase transition-colors duration-200 hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60"
                    : adminDangerButtonClass
                }
              >
                {deleting
                  ? "Deleting…"
                  : step === 1
                    ? "Continue"
                    : "Delete permanently"}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default DeleteConfirmModal;
