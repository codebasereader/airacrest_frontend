import { getImageKey, getImageUrl } from "./catalogImage";
import { slugify } from "../../utils/slugify";

export { slugify };

export const BLOG_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export const EMPTY_BLOG_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  product: "",
  status: "draft",
  author: "Aira Crest Team",
  tags: "",
};

export const getRelationId = (relation) => {
  if (!relation) return "";
  if (typeof relation === "string") return relation;
  return relation._id || "";
};

export const toBlogFormState = (blog) => ({
  title: blog.title || "",
  slug: blog.slug || "",
  excerpt: blog.excerpt || "",
  content: blog.content || "",
  product: getRelationId(blog.product),
  status: blog.status || "draft",
  author: blog.author || "Aira Crest Team",
  tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
});

export const toBlogPayload = (form, coverImageKey) => {
  const tags = form.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const payload = {
    title: form.title.trim(),
    slug: form.slug.trim() || slugify(form.title),
    excerpt: form.excerpt.trim(),
    content: form.content,
    status: form.status,
    author: form.author.trim() || "Aira Crest Team",
    tags,
  };

  if (coverImageKey) {
    payload.coverImage = coverImageKey;
  } else {
    payload.coverImage = null;
  }

  if (form.product) {
    payload.product = form.product;
  } else {
    payload.product = null;
  }

  return payload;
};

export const getBlogCoverUrl = (blog) => {
  if (!blog?.coverImage) return null;
  return getImageUrl(blog.coverImage);
};

export const getBlogCoverKey = (blog) => getImageKey(blog?.coverImage);

export const formatBlogDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
