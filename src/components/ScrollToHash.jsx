import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToElementWhenReady, scrollToTop } from "../utils/scrollToSection";

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === "/" && hash) {
      const sectionId = hash.replace("#", "");
      if (!sectionId) return;

      const timeoutId = window.setTimeout(() => {
        scrollToElementWhenReady(sectionId);
      }, 50);

      return () => window.clearTimeout(timeoutId);
    }

    scrollToTop();
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
