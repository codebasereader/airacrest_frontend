import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store/store.js";
import {
  isCrawlerUserAgent,
  shouldSkipCrawlerRemount,
} from "./motion/useStaticMotion.js";

const userAgent = navigator.userAgent;

if (isCrawlerUserAgent(userAgent)) {
  document.documentElement.classList.add("seo-static");
}

const skipCrawlerRemount = shouldSkipCrawlerRemount({
  userAgent,
  prerenderReady: document.documentElement.hasAttribute("data-prerender-ready"),
  canonicalHref:
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
  currentPathname: window.location.pathname,
});

if (!skipCrawlerRemount) {
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
}
