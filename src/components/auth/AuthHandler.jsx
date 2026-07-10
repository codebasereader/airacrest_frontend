import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler } from "../../api/client";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";

const AuthHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setUnauthorizedHandler((status) => {
      dispatch(logout());

      if (status === 401) {
        navigate("/login", { replace: true });
      }
    });

    return () => setUnauthorizedHandler(null);
  }, [dispatch, navigate]);

  return null;
};

export default AuthHandler;
