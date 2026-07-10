import { useCallback, useEffect, useState } from "react";
import * as blogsApi from "../../api/blogsApi";
import { ApiError } from "../../api/client";
import { normalizeLoadMoreResponse } from "../../api/loadMore";

const sortByDate = (items) =>
  [...items].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });

export const useBlogs = (filters = {}) => {
  const { status = "" } = filters;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const apiFilters = {};
      if (status) apiFilters.status = status;

      const data = await blogsApi.listAdminBlogs(apiFilters);
      const { items } = normalizeLoadMoreResponse(data);
      setBlogs(sortByDate(items));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load blogs. Please try again.",
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const createBlog = async (formData) => {
    setSaving(true);
    setError(null);

    try {
      const created = await blogsApi.createBlog(formData);
      await fetchBlogs({ silent: true });
      return created;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to create blog. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateBlog = async (id, formData) => {
    setSaving(true);
    setError(null);

    try {
      const updated = await blogsApi.updateBlog(id, formData);
      await fetchBlogs({ silent: true });
      return updated;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to update blog. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeBlog = async (id) => {
    setSaving(true);
    setError(null);

    try {
      await blogsApi.deleteBlog(id);
      setBlogs((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete blog. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    blogs,
    loading,
    saving,
    error,
    setError,
    fetchBlogs,
    createBlog,
    updateBlog,
    removeBlog,
  };
};
