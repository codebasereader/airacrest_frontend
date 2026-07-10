import { apiRequest } from "./client";

export const login = (credentials) =>
  apiRequest("auth/login", {
    method: "POST",
    body: credentials,
  });

export const getCurrentUser = () =>
  apiRequest("auth/me", {
    method: "GET",
    auth: true,
  });
