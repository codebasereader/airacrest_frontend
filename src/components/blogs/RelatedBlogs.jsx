import React from "react";
import { Link } from "react-router-dom";
import { useRelatedBlogs } from "../../hooks/usePublicBlogs";
import { formatBlogDate, getBlogCoverUrl } from "../../admin/utils/blogForm";

const RelatedBlogs = ({ productId }) => {
  const { blogs, loading } = useRelatedBlogs(productId, 3);

  if (loading) {
    return (
      <section className="mt-16 border-t border-maroon-200/40 pt-12 lg:mt-20 lg:pt-16">
        <h2 className="font-heading text-xl font-bold tracking-[0.1em] text-maroon-900 sm:text-2xl">
          RELATED ARTICLES
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-xl border border-maroon-200/40 bg-white"
            >
              <div className="aspect-[16/10] bg-cream-200/80" />
              <div className="px-4 py-4">
                <div className="h-3 w-2/3 rounded bg-cream-200/80" />
                <div className="mt-2 h-3 w-full rounded bg-cream-200/60" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <section className="mt-16 border-t border-maroon-200/40 pt-12 lg:mt-20 lg:pt-16">
      <h2 className="font-heading text-xl font-bold tracking-[0.1em] text-maroon-900 sm:text-2xl">
        RELATED ARTICLES
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {blogs.map((blog) => {
          const coverUrl = getBlogCoverUrl(blog);

          return (
            <Link
              key={blog._id}
              to={`/blogs/${blog.slug}`}
              className="group overflow-hidden rounded-xl border border-maroon-200/40 bg-white no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-maroon-300 hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden bg-cream-200/60">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-cream-100">
                    <span className="font-heading text-2xl text-maroon-300">
                      {blog.title?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 py-4">
                {blog.publishedAt && (
                  <time
                    dateTime={blog.publishedAt}
                    className="font-sans text-[9px] font-semibold tracking-[0.12em] text-gold-600 uppercase"
                  >
                    {formatBlogDate(blog.publishedAt)}
                  </time>
                )}
                <p className="mt-2 font-heading text-xs font-bold leading-snug tracking-[0.06em] text-maroon-900 transition-colors group-hover:text-maroon-700 sm:text-sm">
                  {blog.title}
                </p>
                {blog.excerpt && (
                  <p className="mt-2 line-clamp-2 font-sans text-[11px] leading-relaxed text-maroon-600">
                    {blog.excerpt}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 font-sans text-[10px] font-semibold tracking-[0.14em] text-gold-600">
                  READ MORE →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedBlogs;
