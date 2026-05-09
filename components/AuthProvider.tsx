"use client";

import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");
      
      // Convert input to string URL for checking
      let url: string;
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else {
        url = input.url;
      }
      
      // Only intercept API calls
      if (url.startsWith("/api/") || url.startsWith(window.location.origin + "/api/")) {
        // Clone init to avoid mutating the original
        const newInit: RequestInit = init ? { ...init } : {};
        
        // Handle headers properly (could be plain object, Headers instance, or undefined)
        let headers: Record<string, string> = {};
        if (newInit.headers) {
          if (newInit.headers instanceof Headers) {
            newInit.headers.forEach((value, key) => {
              headers[key] = value;
            });
          } else if (Array.isArray(newInit.headers)) {
            newInit.headers.forEach(([key, value]) => {
              headers[key] = value;
            });
          } else {
            headers = { ...newInit.headers as Record<string, string> };
          }
        }
        
        // Add auth headers
        headers["X-User-Id"] = userId || "";
        headers["X-User-Role"] = userRole || "";
        
        newInit.headers = headers;
        
        return originalFetch(input, newInit);
      }
      
      return originalFetch(input, init);
    };
  }, []);

  return <>{children}</>;
}
