import { useCallback, useEffect, useState } from "react";
import * as subcategoriesApi from "../../api/subcategoriesApi";
import { ApiError } from "../../api/client";

export const EMPTY_SUBCATEGORY_FORM = {
  name: "",
  category: "",
  description: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

const getCategoryId = (item) => item?.category?._id || item?.category || "";

const sortByOrder = (items) =>
  [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

export const useSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubcategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await subcategoriesApi.listAdminSubcategories();
      setSubcategories(Array.isArray(data) ? sortByOrder(data) : []);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load subcategories. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  const createSubcategory = async (formData) => {
    setSaving(true);
    setError(null);

    try {
      const created = await subcategoriesApi.createSubcategory(formData);
      setSubcategories((prev) => sortByOrder([...prev, created]));
      return created;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to create subcategory. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateSubcategory = async (id, formData) => {
    setSaving(true);
    setError(null);

    try {
      const updated = await subcategoriesApi.updateSubcategory(id, formData);
      setSubcategories((prev) =>
        sortByOrder(
          prev.map((item) => (item._id === id ? updated : item)),
        ),
      );
      return updated;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to update subcategory. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeSubcategory = async (id) => {
    setSaving(true);
    setError(null);

    try {
      await subcategoriesApi.deleteSubcategory(id);
      setSubcategories((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete subcategory. Please try again.";
      if (!(err instanceof ApiError && err.status === 409)) {
        setError(message);
      }
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    subcategories,
    loading,
    saving,
    error,
    setError,
    fetchSubcategories,
    createSubcategory,
    updateSubcategory,
    removeSubcategory,
    getCategoryId,
  };
};
