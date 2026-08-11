import React, { useId, useState } from "react";
import { Link } from "react-router-dom";
import {motion} from "motion/react";
import { useStaticMotion } from "../../motion/useStaticMotion";
import { fadeUp, stagger } from "../../motion/presets";
import { toBritishSpelling } from "../../utils/britishSpelling";
import {
  getPreviewFaqs,
  getProductFaqPath,
  getVisibleFaqs,
} from "../../utils/productUtils";

const FaqItem = ({ faq, index, open, onToggle }) => {
  const panelId = useId();

  return (
    <motion.div
      variants={fadeUp}
      className={`border-b border-maroon-100 last:border-b-0 ${
        index % 2 === 0 ? "bg-white" : "bg-cream-50/60"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        disabled={!onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-cream-100/80 sm:px-6 sm:py-5 disabled:cursor-default"
      >
        <span className="font-sans text-sm font-semibold leading-snug text-maroon-900 sm:text-[0.95rem]">
          {toBritishSpelling(faq.question)}
        </span>
        <span
          aria-hidden="true"
          className={`mt-0.5 shrink-0 font-sans text-lg leading-none text-maroon-600 transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {/* Keep answers in the HTML for crawlers/prerender even when collapsed. */}
      <div
        id={panelId}
        hidden={!open}
        className="px-5 pb-5 sm:px-6 sm:pb-6"
      >
        <p className="font-sans text-xs leading-relaxed text-maroon-800 sm:text-sm sm:leading-6">
          {toBritishSpelling(faq.answer)}
        </p>
      </div>
    </motion.div>
  );
};

const ProductFaqPreview = ({
  product,
  faqs,
  previewOnly = true,
  showHeading = true,
  className = "mt-14 lg:mt-20",
}) => {
  const prefersReducedMotion = useStaticMotion();
  const visibleFaqs = getVisibleFaqs(faqs);
  const displayFaqs = previewOnly ? getPreviewFaqs(faqs) : visibleFaqs;
  const [openIndex, setOpenIndex] = useState(0);

  if (displayFaqs.length === 0) {
    return null;
  }

  const hasMore = previewOnly && visibleFaqs.length > displayFaqs.length;
  const faqPath = getProductFaqPath(product);

  return (
    <section
      aria-labelledby={showHeading ? "faq-heading" : undefined}
      aria-label={showHeading ? undefined : "Frequently Asked Questions"}
      className={className}
    >
      {showHeading && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="faq-heading"
            className="font-heading text-xl font-bold tracking-[0.08em] text-maroon-900 sm:text-2xl"
          >
            Frequently Asked Questions
          </h2>
          {hasMore && (
            <Link
              to={faqPath}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-maroon-800 no-underline transition-colors hover:text-maroon-950"
            >
              VIEW ALL
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      )}

      <motion.div
        className={`${showHeading ? "mt-6" : ""} overflow-hidden rounded-2xl border border-maroon-200/50 shadow-[0_8px_32px_-12px_rgba(42,10,10,0.1)]`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={prefersReducedMotion ? fadeUp : stagger(0.04, 0.1)}
      >
        {displayFaqs.map((faq, index) => (
          <FaqItem
            key={faq._id || faq.id || `${faq.question}-${index}`}
            faq={faq}
            index={index}
            open={previewOnly ? openIndex === index : true}
            onToggle={
              previewOnly
                ? () =>
                    setOpenIndex((current) =>
                      current === index ? -1 : index,
                    )
                : undefined
            }
          />
        ))}
      </motion.div>

      {hasMore && (
        <div className="mt-5 flex justify-start sm:justify-end">
          <Link
            to={faqPath}
            className="inline-flex items-center gap-1.5 rounded-sm border border-maroon-700 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.14em] text-maroon-900 no-underline transition-colors duration-200 hover:border-maroon-900 hover:bg-maroon-50"
          >
            VIEW ALL FAQS
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProductFaqPreview;
