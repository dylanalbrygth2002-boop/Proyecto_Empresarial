"use client";

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return {
    "X-User-Id": localStorage.getItem("userId") || "",
    "X-User-Role": localStorage.getItem("userRole") || "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
