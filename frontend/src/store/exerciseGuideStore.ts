import { create } from "zustand";
import type { ApiExerciseSummary } from "../utils/api";

interface ExerciseGuideState {
  current: ApiExerciseSummary | null;
  open: (exercise: ApiExerciseSummary) => void;
  close: () => void;
}

export const useExerciseGuideStore = create<ExerciseGuideState>((set) => ({
  current: null,
  open: (exercise) => set({ current: exercise }),
  close: () => set({ current: null })
}));
