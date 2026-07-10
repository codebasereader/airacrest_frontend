import { useCallback, useEffect, useState } from "react";
import * as blogsApi from "../api/blogsApi";
import { ApiError } from "../api/client";
import { normalizeLoadMoreResponse } from "../api/loadMore";
import {
  DUMMY_BLOGS,
  getDummyBlogBySlug,
  getDummyBlogsByProduct,
} from "../data/dummyBlogs";

const sortByDate = (items) =>
  [...items].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });

const useDummyData = () => import.meta.env.VITE_USE_DUMMY_BLOGS !== "false";

export const usePublicBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await blogsApi.listPublicBlogs();
      const { items } = normalizeLoadMoreResponse(data);
      setBlogs(sortByDate(items));
      setUsingDummyData(false);
    } catch (err) {
      if (useDummyData()) {
        setBlogs(sortByDate(DUMMY_BLOGS));
        setUsingDummyData(true);
        setError(null);
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load blogs. Please try again.",
        );
        setBlogs([]);
        setUsingDummyData(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, usingDummyData, refetch: fetchBlogs };
};

export const usePublicBlog = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setBlog(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await blogsApi.getPublicBlog(slug);
        if (!cancelled) setBlog(data ?? null);
      } catch (err) {
        if (!cancelled) {
          if (useDummyData()) {
            setBlog(getDummyBlogBySlug(slug));
            setError(null);
          } else {
            setError(
              err instanceof ApiError
                ? err.message
                : "Failed to load blog. Please try again.",
            );
            setBlog(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBlog();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { blog, loading, error };
};

export const useRelatedBlogs = (productId, limit = 3) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setBlogs([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadRelated = async () => {
      setLoading(true);

      try {
        const data = await blogsApi.listBlogsByProduct(productId, limit);
        if (!cancelled) {
          const { items } = normalizeLoadMoreResponse(data);
          setBlogs(sortByDate(items).slice(0, limit));
        }
      } catch {
        if (!cancelled) {
          const dummy = getDummyBlogsByProduct(productId).slice(0, limit);
          setBlogs(dummy);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRelated();

    return () => {
      cancelled = true;
    };
  }, [productId, limit]);

  return { blogs, loading };
};
