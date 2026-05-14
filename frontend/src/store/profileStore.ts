import { create } from "zustand";
import { ApiProfile, getProfile } from "../utils/api";

interface ProfileState {
  profile: ApiProfile | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
  load: () => Promise<void>;
  setProfile: (profile: ApiProfile) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  fetched: false,
  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const profile = await getProfile();
      set({ profile, loading: false, fetched: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Не удалось загрузить профиль",
        loading: false,
        fetched: true
      });
    }
  },
  setProfile: (profile) => set({ profile, fetched: true })
}));
