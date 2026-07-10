import { API_BASE_URL } from "../config";
import { AUTH_TOKEN_KEY } from "../constants/auth";

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const buildUrl = (path) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");
  return `${base}/${normalizedPath}`;
};

export async function apiRequest(path, options = {}) {
  const { auth = false, body, headers: customHeaders, ...fetchOptions } =
    options;

  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json;
  try {
    json = await response.json();
  } catch {
    throw new ApiError("Invalid server response", response.status);
  }

  if (!response.ok || !json.success) {
    if (response.status === 401 || response.status === 403) {
      unauthorizedHandler?.(response.status);
    }

    throw new ApiError(
      json.message || "Something went wrong. Please try again.",
      response.status,
      json.data ?? null,
    );
  }

  return json.data;
}
