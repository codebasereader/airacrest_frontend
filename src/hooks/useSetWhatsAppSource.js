import { useEffect } from "react";
import { useWhatsAppSource } from "../context/WhatsAppSourceContext";

/**
 * Registers a page-specific WhatsApp source tag (e.g. product name)
 * for the floating button. Clears on unmount or when sourceTag changes.
 */
export const useSetWhatsAppSource = (sourceTag) => {
  const ctx = useWhatsAppSource();

  useEffect(() => {
    if (!ctx) return undefined;

    ctx.setOverride(sourceTag);
    return () => ctx.setOverride(null);
  }, [ctx, sourceTag]);
};
