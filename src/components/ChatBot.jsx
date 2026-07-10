import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiChat01Icon,
  Cancel01Icon,
  ChatBotIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { transitions } from "../motion/presets";

const QUICK_PROMPTS = [
  "Tell me about your products",
  "Export & shipping details",
  "Request a bulk quote",
];

const WELCOME_MESSAGE =
  "Hello! I'm the Aira Crest assistant. Ask me about our dehydrated vegetables, wild honey, export capabilities, or bulk enquiries — integration coming soon.";

const ChatBot = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const hideOnRoute =
    pathname === "/login" || pathname.startsWith("/admin");

  if (hideOnRoute) {
    return null;
  }

  const panelTransition = prefersReducedMotion
    ? transitions.instant
    : { type: "spring", stiffness: 380, damping: 30 };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Aira Crest AI assistant"
            aria-modal="true"
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 16, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.96 }
            }
            transition={panelTransition}
            className="pointer-events-auto mb-4 flex w-[min(100vw-2.5rem,380px)] flex-col overflow-hidden rounded-2xl border border-maroon-200/40 bg-cream-50 shadow-[0_20px_60px_-12px_rgba(42,10,10,0.35)]"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-header px-5 py-4">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(212,175,55,0.15)_0%,transparent_60%)]"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/40 bg-maroon-950/40">
                    <HugeiconsIcon
                      icon={AiChat01Icon}
                      size={20}
                      color="currentColor"
                      strokeWidth={1.5}
                      className="text-gold-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold tracking-[0.1em] text-gold-400">
                      AIRA CREST AI
                    </p>
                    <p className="mt-0.5 font-sans text-[11px] text-cream-200/75">
                      Premium export assistant
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-cream-100/15 bg-cream-100/5 text-cream-100 transition-colors hover:border-gold-400/40 hover:text-gold-400"
                  aria-label="Close chat"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex max-h-[320px] min-h-[220px] flex-1 flex-col gap-4 overflow-y-auto bg-cream-100/80 px-4 py-5 sm:max-h-[360px]">
              <div className="flex gap-2.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-white">
                  <HugeiconsIcon
                    icon={ChatBotIcon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.5}
                    className="text-maroon-700"
                    aria-hidden="true"
                  />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-maroon-100 bg-white px-4 py-3 shadow-sm">
                  <p className="font-sans text-sm leading-relaxed text-maroon-800">
                    {WELCOME_MESSAGE}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pl-10">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setMessage(prompt)}
                    className="cursor-pointer rounded-full border border-maroon-200/70 bg-white px-3 py-1.5 font-sans text-[11px] font-medium text-maroon-700 transition-colors hover:border-maroon-400 hover:bg-cream-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-maroon-100 bg-white p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={2}
                  placeholder="Type your message..."
                  className="max-h-24 min-h-[44px] flex-1 resize-none rounded-xl border border-maroon-200/60 bg-cream-50/80 px-3.5 py-2.5 font-sans text-sm text-maroon-900 placeholder:text-maroon-400/60 focus:border-maroon-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-600/10"
                />
                <button
                  type="button"
                  disabled
                  aria-label="Send message (coming soon)"
                  className="inline-flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-xl bg-gold-500/50 text-maroon-950/50"
                  title="Coming soon"
                >
                  <HugeiconsIcon
                    icon={SentIcon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <p className="mt-2 text-center font-sans text-[10px] tracking-wide text-maroon-500/70">
                AI responses coming soon
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        className="pointer-events-auto relative inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-gold-400/50 bg-header text-gold-400 shadow-[0_8px_32px_-4px_rgba(42,10,10,0.45)] transition-colors hover:border-gold-400 hover:bg-maroon-950"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        transition={transitions.fast}
      >
        <span
          className="absolute inset-0 rounded-full bg-gold-400/10 blur-md"
          aria-hidden="true"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: prefersReducedMotion ? 0 : -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: prefersReducedMotion ? 0 : 90 }}
            transition={transitions.fast}
            className="relative inline-flex"
          >
            <HugeiconsIcon
              icon={isOpen ? Cancel01Icon : ChatBotIcon}
              size={26}
              color="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatBot;
