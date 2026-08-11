import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const WhatsAppSourceContext = createContext(null);

export const WhatsAppSourceProvider = ({ children }) => {
  const [override, setOverrideState] = useState(null);

  const setOverride = useCallback((value) => {
    if (value == null || String(value).trim() === "") {
      setOverrideState(null);
      return;
    }
    setOverrideState(String(value).trim());
  }, []);

  const value = useMemo(
    () => ({ override, setOverride }),
    [override, setOverride],
  );

  return (
    <WhatsAppSourceContext.Provider value={value}>
      {children}
    </WhatsAppSourceContext.Provider>
  );
};

export const useWhatsAppSource = () => useContext(WhatsAppSourceContext);
