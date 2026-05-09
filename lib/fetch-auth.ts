export function getAuthHeaders(): Record<string, string> {
  const userId = localStorage.getItem("userId");
  const headers: Record<string, string> = {};
  if (userId) {
    headers["X-User-Id"] = userId;
  }
  return headers;
}