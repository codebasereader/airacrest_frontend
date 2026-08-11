import React from "react";
import { Navigate } from "react-router-dom";
import {motion} from "motion/react";
import { useStaticMotion } from "../motion/useStaticMotion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SeoHead from "../components/SeoHead";
import PrerenderReady from "../components/PrerenderReady";
import PublicBlogCard from "../components/blogs/PublicBlogCard";
import { usePublicBlogs } from "../hooks/usePublicBlogs";
import { areBlogsPubliclyVisible } from "../constants/blogs";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";
import { stagger } from "../motion/presets";

const BlogGridSkeleton = () => (
  <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-2">
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-2xl bg-white"
      >
        <div className="aspect-[16/10] bg-cream-200/80" />
        <div className="space-y-3 px-6 py-6">
          <div className="h-3 w-24 rounded bg-cream-200/60" />
          <div className="h-5 w-4/5 rounded bg-cream-200/80" />
          <div className="h-3 w-full rounded bg-cream-200/60" />
          <div className="h-3 w-5/6 rounded bg-cream-200/60" />
        </div>
      </div>
    ))}
  </div>
);

const BlogsPage = () => {
  const prefersReducedMotion = useStaticMotion();
  const { blogs, loading, error } = usePublicBlogs();

  if (!loading && !areBlogsPubliclyVisible(blogs)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <SeoHead
        title="Insights & Articles"
        path="/blogs"
        description="Export guides, sourcing insights, and product knowledge from Aira Crest — helping global buyers make informed decisions about Indian dehydrated foods and spices."
      />
      <PrerenderReady ready={!loading && areBlogsPubliclyVisible(blogs)} />
      <Header />

      <main className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div
          className="pointer-events-none absolute -top-16 right-0 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-maroon-300/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1200px]">
          <LineRevealGroup
            className="text-center"
            trigger="onMount"
            gap={0.1}
            delay={0.05}
          >
            <LineReveal>
              <h1 className="font-heading text-2xl font-bold tracking-[0.12em] text-maroon-900 sm:text-3xl lg:text-4xl">
                INSIGHTS &amp; ARTICLES
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
                Export guides, sourcing insights, and product knowledge from the
                Aira Crest team — helping global buyers make informed decisions
                about Indian dehydrated vegetables and spices.
              </p>
            </LineReveal>
          </LineRevealGroup>

          {loading && <BlogGridSkeleton />}

          {error && !loading && (
            <p className="mt-12 text-center font-sans text-sm text-maroon-700">
              {error}
            </p>
          )}

          {!loading && !error && areBlogsPubliclyVisible(blogs) && (
            <motion.div
              className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-2"
              initial="hidden"
              animate="visible"
              variants={prefersReducedMotion ? undefined : stagger(0.1, 0.15)}
            >
              {blogs.map((blog, index) => (
                <PublicBlogCard key={blog._id} blog={blog} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogsPage;
