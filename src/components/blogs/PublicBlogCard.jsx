import React from "react";
import { Link } from "react-router-dom";
import {motion} from "motion/react";
import { useStaticMotion } from "../../motion/useStaticMotion";
import { formatBlogDate, getBlogCoverUrl } from "../../admin/utils/blogForm";
import { fadeUp } from "../../motion/presets";

const PublicBlogCard = ({ blog, index = 0 }) => {
  const prefersReducedMotion = useStaticMotion();
  const coverUrl = getBlogCoverUrl(blog);

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="group flex flex-col overflow-hidden rounded-2xl border border-maroon-200/40 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-maroon-300 hover:shadow-lg"
    >
      <Link
        to={`/blogs/${blog.slug}`}
        className="flex flex-1 flex-col no-underline"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-cream-200/60">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-cream-100 to-maroon-100/30">
              <span className="font-heading text-4xl text-maroon-300/60">
                {blog.title?.charAt(0) || "A"}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          {blog.publishedAt && (
            <time
              dateTime={blog.publishedAt}
              className="font-sans text-[10px] font-semibold tracking-[0.14em] text-gold-600 uppercase"
            >
              {formatBlogDate(blog.publishedAt)}
            </time>
          )}

          <h2 className="mt-3 font-heading text-base font-bold leading-snug tracking-[0.04em] text-maroon-900 transition-colors group-hover:text-maroon-700 sm:text-lg">
            {blog.title}
          </h2>

          {blog.excerpt && (
            <p className="mt-3 line-clamp-3 flex-1 font-sans text-sm leading-relaxed text-maroon-700/90">
              {blog.excerpt}
            </p>
          )}

          {blog.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-cream-100 px-2.5 py-0.5 font-sans text-[10px] font-medium tracking-wide text-maroon-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-gold-600">
            READ ARTICLE
            <motion.span
              aria-hidden="true"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { x: [0, 4, 0] }
              }
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default PublicBlogCard;
