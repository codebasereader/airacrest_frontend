export const HEADER_SCROLL_OFFSET = 140;

export const getScrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

export const scrollToElement = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    HEADER_SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: getScrollBehavior(),
  });

  return true;
};

export const scrollToElementWhenReady = (sectionId, maxAttempts = 40) =>
  new Promise((resolve) => {
    let attempts = 0;

    const tryScroll = () => {
      const didScroll = scrollToElement(sectionId);
      if (didScroll || attempts >= maxAttempts) {
        resolve(didScroll);
        return;
      }

      attempts += 1;
      requestAnimationFrame(tryScroll);
    };

    tryScroll();
  });

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: getScrollBehavior() });
};
