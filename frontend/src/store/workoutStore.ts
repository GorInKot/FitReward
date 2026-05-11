import { create } from "zustand";

interface WorkoutState {
  currentWorkoutId?: string;
  currentExerciseIndex: number;
  setWorkout: (id: string) => void;
  nextExercise: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentWorkoutId: undefined,
  currentExerciseIndex: 0,
  setWorkout: (id) => set({ currentWorkoutId: id, currentExerciseIndex: 0 }),
  nextExercise: () =>
    set((state) => ({ currentExerciseIndex: state.currentExerciseIndex + 1 }))
}));
