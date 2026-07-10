import { apiRequest } from "./client";

const buildPublicListPath = ({ product, search, limit } = {}) => {
  const params = new URLSearchParams();
  if (product) params.set("product", product);
  if (search) params.set("search", search);
  if (limit) params.set("limit", String(limit));
  const query = params.toString();
  return query ? `blogs?${query}` : "blogs";
};

const buildAdminListPath = ({ status, product } = {}) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (product) params.set("product", product);
  const query = params.toString();
  return query ? `admin/blogs?${query}` : "admin/blogs";
};

export const listPublicBlogs = (filters) =>
  apiRequest(buildPublicListPath(filters), { method: "GET" });

export const getPublicBlog = (slug) =>
  apiRequest(`blogs/${encodeURIComponent(slug)}`, { method: "GET" });

export const listBlogsByProduct = (productId, limit) =>
  apiRequest(buildPublicListPath({ product: productId, limit }), {
    method: "GET",
  });

export const listAdminBlogs = (filters) =>
  apiRequest(buildAdminListPath(filters), { method: "GET", auth: true });

export const getBlog = (id) =>
  apiRequest(`admin/blogs/${id}`, { method: "GET", auth: true });

export const createBlog = (data) =>
  apiRequest("admin/blogs", {
    method: "POST",
    body: data,
    auth: true,
  });

export const updateBlog = (id, data) =>
  apiRequest(`admin/blogs/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

export const deleteBlog = (id) =>
  apiRequest(`admin/blogs/${id}`, {
    method: "DELETE",
    auth: true,
  });
