import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000/api";

// 🔑 ključ pod kojim će se token čuvati u localStorage
export const TOKEN_KEY = "token";

// 🔒 instanca za ulogovane korisnike (uzima token iz localStorage)
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor da ubaci token iz localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🌍 instanca za javne pozive (registracija pacijenta, login...)
export const apiPublic = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
