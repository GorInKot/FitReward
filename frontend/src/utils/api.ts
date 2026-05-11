const API_URL = import.meta.env.VITE_API_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export interface ApiWorkout {
  id: string;
  name: string;
  type: string;
  duration: number;
}

export interface ApiProgress {
  id: string;
  date: string;
  weight?: number;
}

export interface ApiAchievement {
  id: string;
  name: string;
  description: string;
  reward: number;
}

export interface ApiPlan {
  id: string;
  name: string;
  duration: number;
  workoutsPerWeek: number;
  targetGoal: string;
  aiGenerated: boolean;
}

export interface ApiProfile {
  id: string;
  telegramId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  isPremium: boolean;
  age: number | null;
  weight: number | null;
  height: number | null;
  fitnessLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  goals: Array<"WEIGHT_LOSS" | "MUSCLE_GAIN" | "ENDURANCE" | "STRENGTH" | "GENERAL_FITNESS">;
}

export function getWorkouts() {
  return request<ApiWorkout[]>("/api/workouts");
}

export function createDemoWorkout() {
  return request<ApiWorkout>("/api/workouts", {
    method: "POST",
    body: JSON.stringify({
      name: "Demo Strength Session",
      type: "STRENGTH",
      duration: 45,
      exercises: []
    })
  });
}

export function getProgress() {
  return request<ApiProgress[]>("/api/progress");
}

export function addDemoProgress() {
  return request<ApiProgress>("/api/progress", {
    method: "POST",
    body: JSON.stringify({
      date: new Date().toISOString(),
      weight: 80.8,
      notes: "Demo check-in"
    })
  });
}

export function getAchievements(userId = "demo-user") {
  return request<ApiAchievement[]>(`/api/achievements/${userId}`);
}

export function generatePlan() {
  return request<ApiPlan>("/api/plans/generate", {
    method: "POST",
    body: JSON.stringify({
      fitnessLevel: "BEGINNER",
      goals: ["GENERAL_FITNESS"],
      availableTime: 45,
      daysPerWeek: 4
    })
  });
}

export function getProfile(telegramId: string) {
  return request<ApiProfile>(`/api/profile/${telegramId}`);
}

export function updateProfile(
  telegramId: string,
  payload: Partial<Pick<ApiProfile, "firstName" | "lastName" | "username" | "age" | "weight" | "height" | "fitnessLevel" | "goals">>
) {
  return request<ApiProfile>(`/api/profile/${telegramId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
