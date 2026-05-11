export type WorkoutType = "STRENGTH" | "CARDIO" | "HIIT" | "YOGA" | "STRETCHING";

export interface Exercise {
  id: string;
  name: string;
  type: "STRENGTH" | "CARDIO" | "BODYWEIGHT" | "STRETCHING";
  sets?: number;
  reps?: number;
  duration?: number;
  completed: boolean;
  order: number;
}

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  duration: number;
  exercises: Exercise[];
}
