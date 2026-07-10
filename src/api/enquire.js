import { apiRequest } from "./client";

export const submitEnquiry = (data) =>
  apiRequest("enquiries", {
    method: "POST",
    body: data,
  });
