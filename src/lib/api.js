const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export function apiUrl(path = "") {
  const normalizedPath = path.replace(/^\/+/, "");

  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
}

export { API_BASE_URL };
