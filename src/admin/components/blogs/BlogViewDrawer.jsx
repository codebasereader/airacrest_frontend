import React, { useEffect, useState } from "react";
import * as blogsApi from "../../../api/blogsApi";
import { ApiError } from "../../../api/client";
import AdminDrawer from "../shared/AdminDrawer";
import AdminAlert from "../shared/AdminAlert";
import AdminSpinner from "../shared/AdminSpinner";
import { formatBlogDate, getBlogCoverUrl } from "../../utils/blogForm";

const BlogViewDrawer = ({ open, onClose, blog, productName }) => {
  const [fullBlog, setFullBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !blog?._id) {
      setFullBlog(null);
      setError(null);
      return undefined;
    }

    let cancelled = false;

    const loadBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await blogsApi.getBlog(blog._id);
        if (!cancelled) setFullBlog(data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Failed to load blog content. Please try again.",
          );
          setFullBlog(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBlog();

    return () => {
      cancelled = true;
    };
  }, [open, blog?._id]);

  if (!blog) return null;

  const displayBlog = fullBlog ?? blog;
  const coverUrl = getBlogCoverUrl(displayBlog);

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      size="lg"
      title={displayBlog.title}
      description={`${displayBlog.status === "published" ? "Published" : "Draft"}${displayBlog.publishedAt ? ` · ${formatBlogDate(displayBlog.publishedAt)}` : ""}`}
    >
      {loading ? (
        <AdminSpinner label="Loading article content..." />
      ) : (
        <div className="space-y-5">
          {error && <AdminAlert message={error} />}

          {coverUrl && (
            <div className="overflow-hidden rounded-xl border border-maroon-100">
              <img
                src={coverUrl}
                alt={displayBlog.title}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {displayBlog.excerpt && (
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-600 uppercase">
                Excerpt
              </p>
              <p className="mt-1 font-sans text-sm leading-relaxed text-maroon-800">
                {displayBlog.excerpt}
              </p>
            </div>
          )}

          {productName && (
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-600 uppercase">
                Related Product
              </p>
              <p className="mt-1 font-sans text-sm text-maroon-800">{productName}</p>
            </div>
          )}

          {displayBlog.author && (
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-600 uppercase">
                Author
              </p>
              <p className="mt-1 font-sans text-sm text-maroon-800">
                {displayBlog.author}
              </p>
            </div>
          )}

          {displayBlog.tags?.length > 0 && (
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-600 uppercase">
                Tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {displayBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cream-100 px-2.5 py-0.5 font-sans text-[10px] font-medium text-maroon-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-600 uppercase">
              Content Preview
            </p>
            {displayBlog.content ? (
              <div
                className="prose-blog mt-2 max-h-96 overflow-y-auto rounded-lg border border-maroon-100 bg-white p-4 font-sans text-sm leading-relaxed text-maroon-800 [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-bold [&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:font-heading [&_h3]:text-sm [&_h3]:font-bold [&_img]:my-2 [&_img]:rounded-lg [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: displayBlog.content }}
              />
            ) : (
              <p className="mt-2 rounded-lg border border-maroon-100 bg-cream-50 px-3 py-4 font-sans text-sm text-maroon-600">
                No content available for this article.
              </p>
            )}
          </div>

          <p className="font-sans text-[10px] text-maroon-500">
            Slug: /blogs/{displayBlog.slug}
          </p>
        </div>
      )}
    </AdminDrawer>
  );
};

export default BlogViewDrawer;
