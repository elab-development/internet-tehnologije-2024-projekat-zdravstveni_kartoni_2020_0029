export type Role = "patient" | "doctor" | "admin" | "nurse";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
  redirect_to?: string;
  expires_in?: number;
}

export interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
