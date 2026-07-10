let lockCount = 0;
let previousOverflow = "";

export const lockBodyScroll = () => {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  lockCount += 1;

  return () => {
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount === 0) {
      document.body.style.overflow = previousOverflow || "";
      previousOverflow = "";
    }
  };
};

export const resetBodyScroll = () => {
  lockCount = 0;
  document.body.style.overflow = "";
  previousOverflow = "";
};
