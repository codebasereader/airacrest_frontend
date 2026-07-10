export const isAdminUser = (user) => user?.role === "admin";

export const hasAdminAccess = (user, token) =>
  Boolean(token && isAdminUser(user));
