import { api } from "./api";
import type { AuthResponse, User } from "./types";

// LOGIN – backend vraća { success: true, data: { user, token, redirect_to, expires_in } }
export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post("/login", { email, password });
  let raw = res.data;

  // Debug – vidi šta tačno backend vraća
  console.log("🔎 Raw login response:", raw);

  // Ako backend vrati string (npr. zbog BOM-a)
  if (typeof raw === "string") {
    try {
      // ukloni UTF-8 BOM ako postoji
      raw = raw.replace(/^\uFEFF/, "");
      raw = JSON.parse(raw);
    } catch (err) {
      console.error("❌ JSON parse failed:", err, "Raw:", raw);
      throw new Error("Invalid JSON response from server");
    }
  }

  if (!raw?.success || !raw?.data?.user || !raw?.data?.token) {
    throw new Error(raw?.message || "Prijava nije uspela");
  }

  return raw.data; // user, token, redirect_to, expires_in
}

// LOGOUT
export async function logoutRequest(): Promise<void> {
  await api.post("/logout");
}

// ME – vraća trenutno ulogovanog korisnika ili null ako nije prijavljen
export async function meRequest(): Promise<User | null> {
  const res = await api.get("/user");
  let raw = res.data;

  // Debug
  console.log("🔎 Raw me response:", raw);

  if (typeof raw === "string") {
    try {
      raw = raw.replace(/^\uFEFF/, "");
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // Backend vraća { success: true, user: {...} }
  if (raw?.success && raw?.user) {
    return raw.user;
  }

  // Ako backend vrati { success: true, data: { user: {...} } }
  if (raw?.success && raw?.data?.user) {
    return raw.data.user;
  }

  // Ako backend vrati { success: true, data: {...} }
  if (raw?.success && raw?.data) {
    return raw.data;
  }

  return null; // nikada ne baca exception
}










