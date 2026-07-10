import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login as loginRequest, getCurrentUser } from "../../api/authApi";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../constants/auth";
import { hasAdminAccess, isAdminUser } from "../../utils/auth";

const readStoredAuth = () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = localStorage.getItem(AUTH_USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

const persistAuth = ({ token, user }) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

const storedAuth = readStoredAuth();

export const hydrateSession = createAsyncThunk(
  "auth/hydrateSession",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    try {
      const user = await getCurrentUser();
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || "Session expired");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginRequest(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth.user,
    token: storedAuth.token,
    isAuthenticated: hasAdminAccess(storedAuth.user, storedAuth.token),
    status: "idle",
    sessionStatus: storedAuth.token ? "loading" : "ready",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      persistAuth({ token: null, user: null });
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;

        if (!isAdminUser(user)) {
          state.status = "failed";
          state.error = "You do not have admin access.";
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          persistAuth({ token: null, user: null });
          return;
        }

        state.status = "succeeded";
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.error = null;
        persistAuth({ token, user });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        persistAuth({ token: null, user: null });
      })
      .addCase(hydrateSession.pending, (state) => {
        state.sessionStatus = "loading";
      })
      .addCase(hydrateSession.fulfilled, (state, action) => {
        state.sessionStatus = "ready";

        if (!action.payload) {
          state.isAuthenticated = false;
          return;
        }

        const { user, token } = action.payload;

        if (!isAdminUser(user)) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          persistAuth({ token: null, user: null });
          return;
        }

        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        persistAuth({ user, token });
      })
      .addCase(hydrateSession.rejected, (state) => {
        state.sessionStatus = "ready";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        persistAuth({ token: null, user: null });
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectSessionStatus = (state) => state.auth.sessionStatus;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
