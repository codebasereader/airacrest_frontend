import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  Edit02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { getBlogCoverUrl } from "../../utils/blogForm";

const BlogCard = ({
  blog,
  productName,
  saving,
  onView,
  onEdit,
  onDelete,
}) => {
  const coverUrl = getBlogCoverUrl(blog);
  const isPublished = blog.status === "published";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-maroon-200/50 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] bg-cream-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-cream-100 to-cream-200">
            <span className="font-heading text-2xl text-maroon-300">
              {blog.title?.charAt(0) || "?"}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wide uppercase ${
              isPublished
                ? "bg-emerald-100 text-emerald-800"
                : "bg-maroon-100 text-maroon-700"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-sans text-sm font-semibold text-maroon-900">
          {blog.title}
        </h3>

        {productName && (
          <p className="mt-1 font-sans text-[11px] font-medium tracking-wide text-gold-700 uppercase">
            {productName}
          </p>
        )}

        {blog.excerpt && (
          <p className="mt-2 line-clamp-2 flex-1 font-sans text-xs leading-relaxed text-maroon-600">
            {blog.excerpt}
          </p>
        )}

        <p className="mt-3 font-sans text-[10px] tracking-wide text-maroon-500 uppercase">
          {blog.slug ? `/${blog.slug}` : ""}
          {blog.tags?.length
            ? ` · ${blog.tags.length} tag${blog.tags.length === 1 ? "" : "s"}`
            : ""}
        </p>

        <div className="mt-4 flex items-center gap-1.5 border-t border-maroon-100 pt-4">
          <button
            type="button"
            onClick={() => onView(blog)}
            disabled={saving}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-sm border border-maroon-200/70 px-2 py-2 font-sans text-[9px] font-semibold tracking-[0.08em] text-maroon-700 uppercase transition-colors hover:border-maroon-400 hover:bg-maroon-50 disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={ViewIcon}
              size={13}
              color="currentColor"
              strokeWidth={1.75}
            />
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(blog)}
            disabled={saving}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-sm border border-maroon-200/70 bg-cream-50 px-2 py-2 font-sans text-[9px] font-semibold tracking-[0.08em] text-maroon-800 uppercase transition-colors hover:border-maroon-400 hover:bg-white disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.75}
            />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(blog)}
            disabled={saving}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-sm border border-maroon-200/70 px-2 py-2 font-sans text-[9px] font-semibold tracking-[0.08em] text-maroon-600 uppercase transition-colors hover:border-maroon-400 hover:bg-maroon-50 hover:text-maroon-900 disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.75}
            />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
