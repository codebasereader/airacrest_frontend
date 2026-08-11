import React, { useEffect, useId } from "react";
import {motion} from "motion/react";
import { useStaticMotion } from "../../motion/useStaticMotion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthStatus,
} from "../../store/slices/authSlice";
import PasswordInput from "./PasswordInput";

const fieldClass =
  "w-full rounded-sm border border-maroon-200/70 bg-cream-50/80 px-4 py-3.5 font-sans text-sm text-maroon-900 placeholder:text-maroon-400/60 transition-colors duration-200 focus:border-maroon-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-600/10 disabled:cursor-not-allowed disabled:opacity-60";

const LoginForm = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const prefersReducedMotion = useStaticMotion();
  const emailId = useId();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const isLoading = status === "loading";

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      onSuccess?.();
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      noValidate
    >
      <div>
        <label
          htmlFor={emailId}
          className="mb-2 block font-sans text-xs font-semibold tracking-[0.12em] text-maroon-800 uppercase"
        >
          Email Address
        </label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@airacrest.com"
          autoComplete="email"
          disabled={isLoading}
          required
          className={fieldClass}
        />
      </div>

      <PasswordInput
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isLoading}
      />

      {error && (
        <motion.p
          role="alert"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="rounded-sm border border-maroon-300/40 bg-maroon-50 px-4 py-3 font-sans text-sm text-maroon-800"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="group relative mt-2 w-full cursor-pointer overflow-hidden rounded-sm border-0 bg-maroon-800 px-6 py-3.5 font-sans text-xs font-semibold tracking-[0.2em] text-cream-50 uppercase transition-colors duration-200 hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="relative z-10">
          {isLoading ? "Signing in..." : "Sign In"}
        </span>
        <span
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-gold-500/0 via-gold-400/20 to-gold-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
      </button>
    </motion.form>
  );
};

export default LoginForm;
