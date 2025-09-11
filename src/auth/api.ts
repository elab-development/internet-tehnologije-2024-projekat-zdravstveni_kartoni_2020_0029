import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export const TOKEN_KEY = "token";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// čitanje tokena iz localStorage
const getToken = () => localStorage.getItem(TOKEN_KEY);

// interceptor – ubaci Bearer token u sve zahteve
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`, // ✅ backend očekuje Bearer
      Accept: "application/json",
    };
  }
  return config;
});

// response interceptor – ako backend vrati 401, očisti storage
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("app:userSnapshot");
    }
    return Promise.reject(error);
  }
);










