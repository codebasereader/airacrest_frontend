import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePublicBlog } from "../hooks/usePublicBlogs";
import { formatBlogDate, getBlogCoverUrl } from "../admin/utils/blogForm";

const BlogDetailSkeleton = () => (
  <div className="mx-auto max-w-[760px] animate-pulse">
    <div className="h-4 w-32 rounded bg-cream-200/80" />
    <div className="mt-8 h-10 w-4/5 rounded bg-cream-200/80" />
    <div className="mt-4 h-4 w-48 rounded bg-cream-200/60" />
    <div className="mt-10 aspect-[16/9] rounded-2xl bg-cream-200/80" />
    <div className="mt-10 space-y-3">
      <div className="h-4 w-full rounded bg-cream-200/60" />
      <div className="h-4 w-full rounded bg-cream-200/60" />
      <div className="h-4 w-3/4 rounded bg-cream-200/60" />
    </div>
  </div>
);

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { blog, loading, error } = usePublicBlog(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <main className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
          <BlogDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog || error) {
    return <Navigate to="/blogs" replace />;
  }

  const coverUrl = getBlogCoverUrl(blog);

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <main className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div
          className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
          aria-hidden="true"
        />

        <article className="relative mx-auto max-w-[760px]">
          <nav aria-label="Breadcrumb">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold tracking-[0.12em] text-maroon-600 no-underline transition-colors hover:text-maroon-900"
            >
              ← ALL ARTICLES
            </Link>
          </nav>

          <header className="mt-8">
            {blog.tags?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-maroon-100/80 px-3 py-0.5 font-sans text-[10px] font-semibold tracking-wide text-maroon-700 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-heading text-2xl font-bold leading-tight tracking-[0.04em] text-maroon-900 sm:text-3xl lg:text-4xl">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="mt-5 font-sans text-base leading-relaxed text-maroon-700 sm:text-lg">
                {blog.excerpt}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs text-maroon-600">
              {blog.author && (
                <span>
                  By <span className="font-semibold text-maroon-800">{blog.author}</span>
                </span>
              )}
              {blog.publishedAt && (
                <time dateTime={blog.publishedAt}>
                  {formatBlogDate(blog.publishedAt)}
                </time>
              )}
            </div>
          </header>

          {coverUrl && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-maroon-200/40 shadow-md">
              <img
                src={coverUrl}
                alt={blog.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <div
            className="blog-content mt-10 font-sans text-base leading-[1.8] text-maroon-800 [&_a]:text-maroon-700 [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[0.04em] [&_h2]:text-maroon-900 [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-maroon-900 [&_img]:my-6 [&_img]:w-full [&_img]:rounded-xl [&_li]:ml-5 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <footer className="mt-14 border-t border-maroon-200/40 pt-8">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.14em] text-gold-600 no-underline transition-colors hover:text-gold-700"
            >
              ← BACK TO ALL ARTICLES
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
