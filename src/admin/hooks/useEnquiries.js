import { useCallback, useEffect, useState } from "react";
import * as enquiriesApi from "../../api/enquiriesApi";
import { ApiError } from "../../api/client";
import { normalizeLoadMoreResponse } from "../../api/loadMore";

const sortByDate = (items) =>
  [...items].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

export const useEnquiries = (filters = {}) => {
  const { status = "", startDate = "", endDate = "" } = filters;

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loadMore, setLoadMore] = useState({
    hasMore: false,
    nextSkip: 0,
    total: 0,
  });

  const fetchEnquiries = useCallback(
    async ({ skip = 0, append = false } = {}) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const apiFilters = { skip };
        if (status) apiFilters.status = status;
        if (startDate) apiFilters.startDate = startDate;
        if (endDate) apiFilters.endDate = endDate;

        const data = await enquiriesApi.listEnquiries(apiFilters);
        const { items, loadMore: meta } = normalizeLoadMoreResponse(data);
        const sorted = sortByDate(items);

        setEnquiries((prev) => (append ? sortByDate([...prev, ...sorted]) : sorted));
        setLoadMore({
          hasMore: meta.hasMore ?? false,
          nextSkip: meta.nextSkip ?? 0,
          total: meta.total ?? sorted.length,
        });
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load enquiries. Please try again.",
        );
        if (!append) setEnquiries([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [status, startDate, endDate],
  );

  useEffect(() => {
    fetchEnquiries({ skip: 0, append: false });
  }, [fetchEnquiries]);

  const loadMoreEnquiries = () => {
    if (loadMore.hasMore && !loadingMore && !loading) {
      fetchEnquiries({ skip: loadMore.nextSkip, append: true });
    }
  };

  const updateEnquiry = async (id, payload) => {
    setSaving(true);
    setError(null);

    try {
      const updated = await enquiriesApi.updateEnquiry(id, payload);
      setEnquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item)),
      );
      return updated;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to update enquiry. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeEnquiry = async (id) => {
    setSaving(true);
    setError(null);

    try {
      await enquiriesApi.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((item) => item._id !== id));
      setLoadMore((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete enquiry. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    enquiries,
    loading,
    loadingMore,
    loadMore,
    saving,
    error,
    setError,
    fetchEnquiries,
    loadMoreEnquiries,
    updateEnquiry,
    removeEnquiry,
  };
};
