import { useEffect } from "react";

/**
 * Signals to the prerender crawler that this route has finished loading
 * meaningful content (API data, headings, etc.).
 */
const PrerenderReady = ({ ready = false }) => {
  useEffect(() => {
    if (ready) {
      document.documentElement.setAttribute("data-prerender-ready", "true");
    } else {
      document.documentElement.removeAttribute("data-prerender-ready");
    }

    return () => {
      document.documentElement.removeAttribute("data-prerender-ready");
    };
  }, [ready]);

  return null;
};

export default PrerenderReady;
