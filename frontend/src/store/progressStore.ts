import { create } from "zustand";

interface WeightPoint {
  date: string;
  weight: number;
}

interface ProgressState {
  weightHistory: WeightPoint[];
  addWeightPoint: (point: WeightPoint) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  weightHistory: [],
  addWeightPoint: (point) => set((state) => ({ weightHistory: [...state.weightHistory, point] }))
}));
