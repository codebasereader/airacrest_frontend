import { apiRequest } from "./client";

export const getPresignedUrl = (data) =>
  apiRequest("upload/presigned-url", {
    method: "POST",
    body: data,
    auth: true,
  });

export const deleteImage = (key) =>
  apiRequest("upload/delete", {
    method: "POST",
    body: { key },
    auth: true,
  });
