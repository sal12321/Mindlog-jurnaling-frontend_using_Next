const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// ---------- token / user storage ----------
export function getAuthToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("authToken") || "";
}

export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

export function clearAuthToken() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAdmin");
}

export function getCurrentUser() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || {};
  } catch {
    return {};
  }
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function getIsAdmin() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isAdmin") === "true";
}

export function setIsAdmin(value) {
  localStorage.setItem("isAdmin", value ? "true" : "false");
}

// ---------- core fetch wrapper ----------
// Always attaches JWT when present. Only sends the Authorization header
// when a real token exists, so we never send "Bearer undefined".
async function request(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { ok: res.ok, status: res.status, data };
}

// ---------- Public APIs ----------
export function login(userName, password) {
  return request("/public/login", { method: "POST", body: { userName, password }, auth: false });
}

export function signup(userName, email, password, sentimentAnalysis) {
  return request("/public/signup", {
    method: "POST",
    body: { userName, email, password, sentimentAnalysis },
    auth: false,
  });
}

export function getWeather(city) {
  const response =  request(`/public?city=${encodeURIComponent(city)}`, { auth: false });
  return response;
}

// ---------- Journal APIs ----------
export function getAllEntries() {
  return request("/journal");
}

export function getEntryById(id) {
  return request(`/journal/id/${id}`);
}

export function createEntry(entry) {
  return request("/journal", { method: "POST", body: entry });
}

export function updateEntry(id, entry) {
  return request(`/journal/id/${id}`, { method: "PUT", body: entry });
}

export function deleteEntry(id) {
  return request(`/journal/id/${id}`, { method: "DELETE" });
}

// ---------- User APIs ----------
export function sendSentimentEmail() {
  return request("/user/send-me-mail", { method: "POST" });
}

export function updateUser(user) {
  return request("/user", { method: "PUT", body: user });
}

// ---------- Admin APIs ----------
export function getAllUsers() {
  return request("/admin/all-users");
}

export function createAdmin(userName, password, email, sentimentAnalysis) {
  return request("/admin/create-admin", {
    method: "POST",
    body: { userName, password, email, sentimentAnalysis },
  });
}

export { API_URL };
