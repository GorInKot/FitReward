import { create } from "zustand";
import { ApiAchievement, getAchievements, markAchievementsSeen } from "../utils/api";

interface AchievementState {
  achievements: ApiAchievement[];
  loaded: boolean;
  loading: boolean;
  /** Unlocked but not yet shown to the user as a toast. */
  pendingToasts: ApiAchievement[];
  load: (force?: boolean) => Promise<void>;
  dismissToast: (key: string) => Promise<void>;
  /** Fetch fresh state silently — used after actions that may unlock new achievements. */
  refresh: () => Promise<void>;
}

function pickPending(list: ApiAchievement[]): ApiAchievement[] {
  return list.filter((a) => a.unlockedAt !== null && a.notifiedAt === null);
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  loaded: false,
  loading: false,
  pendingToasts: [],
  load: async (force = false) => {
    if (get().loading) return;
    if (get().loaded && !force) return;
    set({ loading: true });
    try {
      const { achievements } = await getAchievements();
      set({ achievements, loaded: true, pendingToasts: pickPending(achievements) });
    } finally {
      set({ loading: false });
    }
  },
  refresh: async () => {
    try {
      const { achievements } = await getAchievements();
      // Merge: keep existing pendingToasts that are still un-notified server-side,
      // plus any new pendings we hadn't seen before.
      const fresh = pickPending(achievements);
      set({ achievements, pendingToasts: fresh });
    } catch {
      // ignore — refresh is fire-and-forget
    }
  },
  dismissToast: async (key) => {
    const list = get().achievements.map((a) =>
      a.key === key && a.notifiedAt === null
        ? { ...a, notifiedAt: new Date().toISOString() }
        : a
    );
    set({
      achievements: list,
      pendingToasts: get().pendingToasts.filter((a) => a.key !== key)
    });
    try {
      await markAchievementsSeen([key]);
    } catch {
      // Server retry will catch up on next load
    }
  }
}));
