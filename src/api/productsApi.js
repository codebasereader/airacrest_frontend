import { apiRequest } from "./client";

const buildListPath = ({ category, subcategory, limit, skip } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (subcategory) params.set("subcategory", subcategory);
  if (limit != null) params.set("limit", String(limit));
  if (skip != null) params.set("skip", String(skip));
  const query = params.toString();
  return query ? `admin/products?${query}` : "admin/products";
};

const buildPublicListPath = ({
  category,
  subcategory,
  featured,
  search,
  limit,
  skip,
} = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (subcategory) params.set("subcategory", subcategory);
  if (featured) params.set("featured", "true");
  if (search) params.set("search", search);
  if (limit != null) params.set("limit", String(limit));
  if (skip != null) params.set("skip", String(skip));
  const query = params.toString();
  return query ? `products?${query}` : "products";
};

export const listPublicProducts = (filters) =>
  apiRequest(buildPublicListPath(filters), { method: "GET" });

export const getPublicProduct = (id) =>
  apiRequest(`products/${id}`, { method: "GET" });

export const getPublicProductBySlug = (slug) =>
  apiRequest(`products/slug/${encodeURIComponent(slug)}`, { method: "GET" });

export const listProducts = (filters) =>
  apiRequest(buildListPath(filters), { method: "GET" });

export const listAdminProducts = (filters) =>
  apiRequest(buildListPath(filters), { method: "GET", auth: true });

export const getProduct = (id) =>
  apiRequest(`admin/products/${id}`, { method: "GET", auth: true });

export const createProduct = (data) =>
  apiRequest("admin/products", {
    method: "POST",
    body: data,
    auth: true,
  });

export const updateProduct = (id, data) =>
  apiRequest(`admin/products/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

export const deleteProduct = (id) =>
  apiRequest(`admin/products/${id}`, {
    method: "DELETE",
    auth: true,
  });
