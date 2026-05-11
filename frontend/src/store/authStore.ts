import { create } from "zustand";

interface AuthState {
  telegramId?: string;
  token?: string;
  setAuth: (telegramId: string, token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  telegramId: undefined,
  token: undefined,
  setAuth: (telegramId, token) => set({ telegramId, token })
}));
