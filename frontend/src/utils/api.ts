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

  return (await response.json()) as T;
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
  recommendationReasons: string[];
  onboardingCompletedAt: string | null;
  onboardingCompleted: boolean;
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
    reasons: string[];
    overridden: boolean;
  };
}

export interface RecommendationPreview {
  structure: TrainingStructure;
  reasons: string[];
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
