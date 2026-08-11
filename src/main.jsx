import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store/store.js";
import { isCrawlerUserAgent } from "./motion/useStaticMotion.js";

if (isCrawlerUserAgent(navigator.userAgent)) {
  document.documentElement.classList.add("seo-static");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
);
