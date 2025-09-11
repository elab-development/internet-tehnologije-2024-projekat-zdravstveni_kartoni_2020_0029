import { User } from '../types/auth';

export const storage = {
  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser(): void {
    localStorage.removeItem('user');
  },
  
  setExpiry(expiry: number): void {
    localStorage.setItem('expiry', expiry.toString());
  },
  
  getExpiry(): number | null {
    const expiry = localStorage.getItem('expiry');
    return expiry ? parseInt(expiry) : null;
  },
  
  removeExpiry(): void {
    localStorage.removeItem('expiry');
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
    this.removeExpiry();
  },
};