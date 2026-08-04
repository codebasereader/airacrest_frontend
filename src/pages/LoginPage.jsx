import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import LoginForm from "../components/auth/LoginForm";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated } from "../store/slices/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleSuccess = () => {
    navigate("/admin/categories", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-header">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.12),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(110,34,41,0.35),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-gold-400/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10 lg:py-16">
        <motion.div
          className="flex flex-col items-center text-center lg:max-w-md lg:items-start lg:text-left"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex no-underline"
            aria-label="Aira Crest — Home"
          >
            <img
              src="/fulllogonew.webp"
              alt="Aira Crest"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>

          <p className="mt-6 font-script text-2xl text-gold-400 sm:text-3xl">
            From Earth&apos;s Best, To the World&apos;s Rest.
          </p>

          <h1 className="mt-6 font-heading text-2xl font-bold tracking-[0.12em] text-cream-50 sm:text-3xl">
            Admin Portal
          </h1>
          <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-cream-100/75 sm:text-base">
            Sign in to manage categories, products, and blog content for the
            Aira Crest global export catalogue.
          </p>

          <div
            className="mt-8 hidden items-center gap-3 lg:flex"
            aria-hidden="true"
          >
            <span className="h-px w-12 bg-gold-400/50" />
            <span className="font-heading text-xs text-gold-500">✦</span>
            <span className="h-px w-12 bg-gold-400/50" />
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 w-full max-w-md lg:mt-0"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-maroon-700/30 bg-cream-50/95 p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-8">
            <div
              className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative">
              <h2 className="font-heading text-lg font-bold tracking-[0.1em] text-maroon-900 sm:text-xl">
                Welcome Back
              </h2>
              <p className="mt-2 font-sans text-sm text-maroon-700">
                Enter your credentials to access the dashboard.
              </p>

              <div className="mt-8">
                <LoginForm onSuccess={handleSuccess} />
              </div>
            </div>
          </div>

          <p className="mt-6 text-center font-sans text-xs text-cream-100/50">
            Authorised personnel only. All activity is monitored.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const LoginPageRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/admin/categories" replace />;
  }

  return <LoginPage />;
};

export default LoginPageRoute;
