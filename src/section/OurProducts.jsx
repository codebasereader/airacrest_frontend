import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { usePublicProducts } from "../hooks/usePublicProducts";
import { getCenteredProductGridClass } from "../utils/productUtils";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";
import { fadeUp, stagger } from "../motion/presets";

const ProductGridSkeleton = () => (
  <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-8">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className={`${getCenteredProductGridClass(index, 3)} animate-pulse overflow-hidden rounded-2xl bg-white`}
      >
        <div className="aspect-square bg-cream-200/80" />
        <div className="space-y-3 px-6 py-6">
          <div className="h-4 w-3/4 rounded bg-cream-200/80" />
          <div className="h-3 w-full rounded bg-cream-200/60" />
          <div className="h-3 w-5/6 rounded bg-cream-200/60" />
        </div>
      </div>
    ))}
  </div>
);

const OurProducts = () => {
  const prefersReducedMotion = useReducedMotion();
  const { products, loading, error } = usePublicProducts({ featured: true });

  return (
    <section
      id="products"
      className="bg-cream-100 px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <LineRevealGroup
          className="text-center"
          trigger="inView"
          gap={0.1}
          delay={0.05}
        >
          <LineReveal>
            <h2 className="font-heading text-2xl font-bold tracking-[0.12em] text-maroon-900 sm:text-3xl lg:text-4xl">
              OUR MAIN PRODUCTS
            </h2>
          </LineReveal>

          <LineReveal>
            <div
              className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-3"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-maroon-300/70" />
              <span className="font-heading text-xs text-gold-500">✦</span>
              <span className="h-px flex-1 bg-maroon-300/70" />
            </div>
          </LineReveal>
        </LineRevealGroup>

        {loading && <ProductGridSkeleton />}

        {error && !loading && (
          <p className="mt-12 text-center font-sans text-sm text-maroon-700">
            {error}
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={prefersReducedMotion ? fadeUp : stagger(0.08, 0.12)}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                variants={fadeUp}
                className={getCenteredProductGridClass(index, products.length)}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="mt-12 flex justify-center lg:mt-16"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-sm border border-maroon-800 bg-transparent px-8 py-3 font-sans text-[11px] font-semibold tracking-[0.2em] text-maroon-900 no-underline transition-colors duration-200 hover:border-maroon-950 hover:bg-maroon-50 sm:px-10 sm:text-xs"
          >
            VIEW ALL PRODUCTS
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default OurProducts;
