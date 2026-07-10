import { apiRequest } from "./client";

const buildListPath = (categoryId) => {
  if (!categoryId) return "admin/subcategories";
  return `admin/subcategories?category=${categoryId}`;
};

export const listAdminSubcategories = (categoryId) =>
  apiRequest(buildListPath(categoryId), { method: "GET", auth: true });

export const getSubcategory = (id) =>
  apiRequest(`admin/subcategories/${id}`, { method: "GET", auth: true });

export const createSubcategory = (data) =>
  apiRequest("admin/subcategories", {
    method: "POST",
    body: data,
    auth: true,
  });

export const updateSubcategory = (id, data) =>
  apiRequest(`admin/subcategories/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

export const deleteSubcategory = (id) =>
  apiRequest(`admin/subcategories/${id}`, {
    method: "DELETE",
    auth: true,
  });
