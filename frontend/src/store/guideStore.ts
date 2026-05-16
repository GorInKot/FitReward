import { create } from "zustand";

const STORAGE_KEY = "fitreward.guideSeen";

export function hasSeenGuide(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

interface GuideState {
  open: boolean;
  openGuide: () => void;
  closeGuide: () => void;
}

export const useGuideStore = create<GuideState>((set) => ({
  open: false,
  openGuide: () => set({ open: true }),
  closeGuide: () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore — guide just re-shows next launch
    }
    set({ open: false });
  }
}));
