import { apiRequest } from "./client";
import { DEFAULT_LIST_LIMIT } from "./loadMore";

const buildListPath = (filters = {}) => {
  const {
    status,
    startDate,
    endDate,
    limit = DEFAULT_LIST_LIMIT,
    skip = 0,
  } = filters;

  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("skip", String(skip));
  if (status) params.set("status", status);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  return `admin/enquiries?${params.toString()}`;
};

export const listEnquiries = (filters) =>
  apiRequest(buildListPath(filters), { method: "GET", auth: true });

export const getEnquiry = (id) =>
  apiRequest(`admin/enquiries/${id}`, { method: "GET", auth: true });

export const updateEnquiry = (id, data) =>
  apiRequest(`admin/enquiries/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

export const deleteEnquiry = (id) =>
  apiRequest(`admin/enquiries/${id}`, {
    method: "DELETE",
    auth: true,
  });
