import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  hydrateSession,
  selectIsAuthenticated,
  selectSessionStatus,
} from "../../store/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionStatus = useAppSelector(selectSessionStatus);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token && sessionStatus === "loading") {
      dispatch(hydrateSession());
    }
  }, [dispatch, sessionStatus]);

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-maroon-200 border-t-maroon-800"
            aria-hidden="true"
          />
          <p className="mt-4 font-sans text-sm text-maroon-700">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
