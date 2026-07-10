import { apiRequest } from "./client";

export const listCategories = () =>
  apiRequest("categories", { method: "GET" });

export const listSubcategoriesByCategory = (categoryId) =>
  apiRequest(`categories/${categoryId}/subcategories`, { method: "GET" });

export const listAdminCategories = () =>
  apiRequest("admin/categories", { method: "GET", auth: true });

export const getCategory = (id) =>
  apiRequest(`admin/categories/${id}`, { method: "GET", auth: true });

export const createCategory = (data) =>
  apiRequest("admin/categories", {
    method: "POST",
    body: data,
    auth: true,
  });

export const updateCategory = (id, data) =>
  apiRequest(`admin/categories/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

export const deleteCategory = (id) =>
  apiRequest(`admin/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
