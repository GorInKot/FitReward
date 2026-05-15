import { getTelegramInitData, getTelegramUserId } from "./telegram";

const API_URL = import.meta.env.VITE_API_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) ?? {})
  };

  const initData = getTelegramInitData();
  if (initData) {
    headers["X-Telegram-Init-Data"] = initData;
  } else {
    headers["X-Dev-Telegram-Id"] = getTelegramUserId();
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = `${body.error} (${response.status})`;
      }
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  // 204 No Content (and any empty body) — return undefined for void endpoints.
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export type PrimaryGoal =
  | "MUSCLE_GAIN"
  | "FAT_LOSS"
  | "GENERAL_FITNESS"
  | "STRENGTH"
  | "ENDURANCE"
  | "BODY_RECOMPOSITION"
  | "RETURN_AFTER_BREAK";

export type ExperienceLevel = "NEVER" | "LESS_THAN_6_MONTHS" | "ONE_TO_TWO_YEARS" | "THREE_PLUS_YEARS";

export type TrainingEnvironment = "GYM" | "HOME" | "HOME_MINIMAL" | "BODYWEIGHT";

export type Limitation = "NONE" | "LOWER_BACK" | "KNEES" | "SHOULDERS" | "POST_INJURY";

export type TrainingStructure = "FULL_BODY" | "UPPER_LOWER" | "PUSH_PULL_LEGS" | "SPLIT";

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
  primaryGoal: PrimaryGoal | null;
  experienceLevel: ExperienceLevel | null;
  trainingDaysPerWeek: number | null;
  trainingEnvironment: TrainingEnvironment | null;
  limitations: Limitation[];
  recommendedStructure: TrainingStructure | null;
  onboardingCompletedAt: string | null;
  onboardingCompleted: boolean;
}

export interface RecommendationReason {
  key: string;
  params?: Record<string, string | number>;
}

export interface OnboardingPayload {
  primaryGoal: PrimaryGoal;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  trainingEnvironment: TrainingEnvironment;
  limitations: Limitation[];
  acceptedStructure?: TrainingStructure;
}

export interface OnboardingResult {
  profile: ApiProfile;
  recommendation: {
    suggestedStructure: TrainingStructure;
    finalStructure: TrainingStructure;
    reasons: RecommendationReason[];
    overridden: boolean;
  };
}

export interface RecommendationPreview {
  structure: TrainingStructure;
  reasons: RecommendationReason[];
}

export function getProfile() {
  return request<ApiProfile>("/api/profile/me");
}

export function updateProfile(
  payload: Partial<Pick<ApiProfile, "firstName" | "lastName" | "username" | "age" | "weight" | "height">>
) {
  return request<ApiProfile>("/api/profile/me", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function submitOnboarding(payload: OnboardingPayload) {
  return request<OnboardingResult>("/api/onboarding", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function previewRecommendation(experienceLevel: ExperienceLevel, trainingDaysPerWeek: number) {
  return request<RecommendationPreview>("/api/onboarding/preview", {
    method: "POST",
    body: JSON.stringify({ experienceLevel, trainingDaysPerWeek })
  });
}

export type MovementCategory =
  | "PUSH"
  | "PULL"
  | "LEGS"
  | "CORE"
  | "CARDIO"
  | "FULL_BODY_COMPOUND";

export type MuscleGroup =
  | "CHEST"
  | "UPPER_BACK"
  | "LATS"
  | "LOWER_BACK"
  | "SHOULDERS_FRONT"
  | "SHOULDERS_SIDE"
  | "SHOULDERS_REAR"
  | "BICEPS"
  | "TRICEPS"
  | "FOREARMS"
  | "QUADS"
  | "HAMSTRINGS"
  | "GLUTES"
  | "CALVES"
  | "ABS"
  | "OBLIQUES";

export type EquipmentKind =
  | "BARBELL"
  | "DUMBBELL"
  | "KETTLEBELL"
  | "MACHINE"
  | "CABLE"
  | "BODYWEIGHT"
  | "RESISTANCE_BAND"
  | "BENCH"
  | "PULL_UP_BAR"
  | "GYMNASTIC_RINGS"
  | "SWISS_BALL"
  | "OTHER";

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ApiExerciseSummary {
  id: string;
  slug: string;
  nameEn: string;
  nameRu: string | null;
  category: MovementCategory;
  primaryMuscles: MuscleGroup[];
  equipment: EquipmentKind[];
  difficulty: Difficulty;
  imageUrl: string | null;
}

export interface ApiProgramExerciseSlot {
  id: string;
  order: number;
  slotName: string;
  suggestedSets: number;
  suggestedRepsLow: number;
  suggestedRepsHigh: number;
  suggestedRestSec: number;
  exercise: ApiExerciseSummary;
}

export interface ApiProgramDay {
  id: string;
  order: number;
  name: string;
  exercises: ApiProgramExerciseSlot[];
}

export interface ApiProgram {
  id: string;
  structure: TrainingStructure;
  status: "ACTIVE" | "ARCHIVED";
  generatedAt: string;
  archivedAt: string | null;
  days: ApiProgramDay[];
}

export function getCurrentProgram() {
  return request<{ program: ApiProgram | null }>("/api/program/current");
}

export function regenerateProgram() {
  return request<{ program: ApiProgram }>("/api/program/regenerate", { method: "POST" });
}

export interface ApiSetLog {
  id: string;
  setNumber: number;
  weight: number | null;
  reps: number;
  rir: number | null;
  completedAt: string;
}

export interface ApiPreviousBest {
  weight: number | null;
  reps: number;
  rir: number | null;
  completedAt: string;
}

export interface ApiSuggestion {
  suggestedWeight: number | null;
  suggestedReps: number;
  rationaleKey: string;
}

export interface ApiSessionExercise {
  id: string;
  order: number;
  slotName: string;
  suggestedSets: number;
  suggestedRepsLow: number;
  suggestedRepsHigh: number;
  suggestedRestSec: number;
  completedAt: string | null;
  exercise: ApiExerciseSummary & { instructions: string | null };
  setLogs: ApiSetLog[];
  previous: ApiPreviousBest | null;
  suggestion: ApiSuggestion | null;
}

export interface ApiWorkoutSession {
  id: string;
  dayName: string;
  startedAt: string;
  completedAt: string | null;
  perceivedFatigue: number | null;
  notes: string | null;
  exercises: ApiSessionExercise[];
}

export interface ApiSessionSummary {
  id: string;
  dayName: string;
  startedAt: string;
  completedAt: string | null;
  perceivedFatigue: number | null;
}

export function getActiveSession() {
  return request<{ session: ApiWorkoutSession | null }>("/api/sessions/active");
}

export function getNextProgramDay() {
  return request<{ nextDay: { id: string; name: string; order: number } | null }>(
    "/api/sessions/program/next-day"
  );
}

export function startSession(programDayId: string) {
  return request<{ session: ApiWorkoutSession }>("/api/sessions", {
    method: "POST",
    body: JSON.stringify({ programDayId })
  });
}

export function logSet(
  sessionId: string,
  payload: {
    sessionExerciseId: string;
    setNumber: number;
    reps: number;
    weight: number | null;
    rir: number | null;
  }
) {
  return request<{ set: ApiSetLog }>(`/api/sessions/${sessionId}/sets`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteSet(sessionId: string, setId: string) {
  return request<void>(`/api/sessions/${sessionId}/sets/${setId}`, { method: "DELETE" });
}

export function completeExercise(sessionId: string, sessionExerciseId: string) {
  return request<{ sessionExercise: ApiSessionExercise }>(
    `/api/sessions/${sessionId}/exercises/complete`,
    {
      method: "POST",
      body: JSON.stringify({ sessionExerciseId })
    }
  );
}

export function completeSession(
  sessionId: string,
  payload: { perceivedFatigue?: number | null; notes?: string | null }
) {
  return request<{ session: ApiWorkoutSession }>(`/api/sessions/${sessionId}/complete`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function abandonSession(sessionId: string) {
  return request<void>(`/api/sessions/${sessionId}`, { method: "DELETE" });
}

export interface ApiBodyMetric {
  id: string;
  date: string;
  weight: number | null;
  bodyFat: number | null;
  notes: string | null;
}

export function getMetrics(limit = 50) {
  return request<{ metrics: ApiBodyMetric[] }>(`/api/metrics?limit=${limit}`);
}

export function createMetric(payload: {
  date?: string;
  weight?: number | null;
  bodyFat?: number | null;
  notes?: string | null;
}) {
  return request<{ metric: ApiBodyMetric }>("/api/metrics", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteMetric(id: string) {
  return request<void>(`/api/metrics/${id}`, { method: "DELETE" });
}

export interface ApiDashboardStats {
  completedSessions: number;
  weekSessionsCount: number;
  weekVolume: number;
  weekMinutes: number;
  streak: number;
}

export interface ApiPersonalRecord {
  exerciseId: string;
  slug: string;
  nameEn: string;
  nameRu: string | null;
  slotName: string;
  weight: number;
  reps: number;
}

export interface ApiCalendarDay {
  date: string;
  trained: boolean;
}

export interface ApiWeightPoint {
  date: string;
  weight: number;
}

export interface ApiFatigueReason {
  key: string;
  params?: Record<string, string | number>;
}

export interface ApiFatigueStatus {
  status: "ok" | "elevated";
  reasons: ApiFatigueReason[];
}

export interface ApiDashboard {
  stats: ApiDashboardStats;
  weightHistory: ApiWeightPoint[];
  calendar: ApiCalendarDay[];
  personalRecords: ApiPersonalRecord[];
  fatigue: ApiFatigueStatus;
}

export function getDashboard() {
  return request<ApiDashboard>("/api/dashboard");
}

export type AchievementCategory = "CONSISTENCY" | "MILESTONE" | "STRENGTH" | "BODY";

export interface ApiAchievement {
  key: string;
  category: AchievementCategory;
  threshold: number | null;
  reward: number;
  unlockedAt: string | null;
  notifiedAt: string | null;
}

export function getAchievements() {
  return request<{ achievements: ApiAchievement[] }>("/api/achievements");
}

export function markAchievementsSeen(keys: string[]) {
  return request<void>("/api/achievements/seen", {
    method: "POST",
    body: JSON.stringify({ keys })
  });
}
