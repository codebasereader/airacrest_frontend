import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { TURNSTILE_SITE_KEY } from "../config";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

let scriptPromise = null;

const loadTurnstileScript = () => {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Turnstile script"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Invisible Cloudflare Turnstile widget. Exposes `execute()` (returns a
 * Promise<token|null>) and `reset()` via ref, so a parent form can run the
 * challenge at submit time instead of showing a visible checkbox.
 *
 * Fails open (resolves null) if the script can't load or isn't configured,
 * so an ad-blocker or CDN hiccup never locks out a genuine enquiry — the
 * backend is expected to treat a missing token as "unverified" and lean on
 * the honeypot + rate limit as the backstop rather than a hard block.
 */
const TurnstileWidget = forwardRef(function TurnstileWidget(_props, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const pendingRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          // Stays invisible unless Cloudflare needs a visible interactive
          // challenge for this visitor; only runs when execute() is called.
          appearance: "interaction-only",
          execution: "execute",
          retry: "never",
          callback: (token) => {
            pendingRef.current?.(token);
            pendingRef.current = null;
          },
          // Error/expiry/timeout all resolve with no token rather than
          // throwing — see the fail-open note in the component doc above.
          "error-callback": () => {
            pendingRef.current?.(null);
            pendingRef.current = null;
            return false;
          },
          "expired-callback": () => {
            pendingRef.current?.(null);
            pendingRef.current = null;
          },
          "timeout-callback": () => {
            pendingRef.current?.(null);
            pendingRef.current = null;
          },
        });
        setReady(true);
      })
      .catch(() => {
        setReady(false);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    execute: () =>
      new Promise((resolve) => {
        if (!ready || widgetIdRef.current == null || !window.turnstile) {
          resolve(null);
          return;
        }

        pendingRef.current = resolve;
        window.turnstile.execute(widgetIdRef.current);
      }),
    reset: () => {
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  return <div ref={containerRef} aria-hidden="true" />;
});

export default TurnstileWidget;
