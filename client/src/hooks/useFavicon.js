import { useEffect } from "react";

/**
 * Custom hook to ensure favicon is properly loaded and cached across the application
 */
const useFavicon = () => {
  useEffect(() => {
    // Force favicon refresh by adding a cache-busting query parameter
    const forceFaviconRefresh = () => {
      // Check if the favicons are already in the browser cache
      const favicons = document.querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"]'
      );

      // Update the href with a cache-busting query parameter
      favicons.forEach((favicon) => {
        const originalHref = favicon.getAttribute("href");
        if (originalHref) {
          // Add or update the cache-busting parameter
          const newHref = originalHref.includes("?v=")
            ? originalHref
            : `${originalHref}?v=${new Date().getTime()}`;

          favicon.setAttribute("href", newHref);
        }
      });
    };

    // Preload favicon images for faster loading
    const preloadFavicons = () => {
      const faviconPaths = [
        "/favicon.ico",
        "/favicons/favicon-16x16.png",
        "/favicons/favicon-32x32.png",
        "/favicons/apple-touch-icon.png",
        "/favicons/android-chrome-192x192.png",
      ];

      faviconPaths.forEach((path) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = path;
        document.head.appendChild(link);
      });
    };

    // Call both functions
    forceFaviconRefresh();
    preloadFavicons();
  }, []);
};

export default useFavicon;
