const API_BASE_URL = "/api/proxy";

export function apiUrl(path = "") {
  const normalizedPath = path.replace(/^\/+/, "");

  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
}

export { API_BASE_URL };
