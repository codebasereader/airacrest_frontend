import React from "react";
import { Link } from "react-router-dom";
import {motion} from "motion/react";
import { useStaticMotion } from "../motion/useStaticMotion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SeoHead from "../components/SeoHead";
import PrerenderReady from "../components/PrerenderReady";
import ProductCard from "../components/ProductCard";
import { usePublicProducts } from "../hooks/usePublicProducts";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";
import { fadeUp, stagger } from "../motion/presets";

const ProductGridSkeleton = () => (
  <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-2xl bg-white"
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

const ProductsPage = () => {
  const prefersReducedMotion = useStaticMotion();
  const { products, loading, error } = usePublicProducts();

  return (
    <div className="min-h-screen bg-cream-100">
      <SeoHead
        title="All Products"
        path="/products"
        description="Explore Aira Crest's full range of premium dehydrated vegetables, spices, and natural honey — sourced from India and prepared for global export."
      />
      <PrerenderReady ready={!loading} />
      <Header />

      <main className="px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <LineRevealGroup
            className="text-center"
            trigger="onMount"
            gap={0.1}
            delay={0.05}
          >
            <LineReveal>
              <h1 className="font-heading text-2xl font-bold tracking-[0.12em] text-maroon-900 sm:text-3xl lg:text-4xl">
                ALL PRODUCTS
              </h1>
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

            <LineReveal>
              <p className="mx-auto mt-6 max-w-2xl font-sans text-sm leading-relaxed text-maroon-800 sm:text-base">
                Explore our full range of premium dehydrated vegetables, spices,
                and natural honey — sourced from India&apos;s finest production
                clusters and prepared for global export.
              </p>
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
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8"
              initial="hidden"
              animate="visible"
              variants={prefersReducedMotion ? fadeUp : stagger(0.08, 0.15)}
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={fadeUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-12 flex justify-center lg:mt-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-sm border border-maroon-800 bg-transparent px-8 py-3 font-sans text-[11px] font-semibold tracking-[0.2em] text-maroon-900 no-underline transition-colors duration-200 hover:border-maroon-950 hover:bg-maroon-50 sm:px-10 sm:text-xs"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
