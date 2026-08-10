/** Minimum published posts before the public Blogs nav and listing are shown. */
export const MIN_PUBLIC_BLOG_COUNT = 2;

export const areBlogsPubliclyVisible = (blogs) =>
  Array.isArray(blogs) && blogs.length >= MIN_PUBLIC_BLOG_COUNT;
