import {
  ExperienceLevel,
  Limitation,
  PrimaryGoal,
  TrainingEnvironment,
  TrainingStructure
} from "../prismaEnums";

export const PROFILE_SELECT = {
  id: true,
  telegramId: true,
  firstName: true,
  lastName: true,
  username: true,
  isPremium: true,
  age: true,
  weight: true,
  height: true,
  primaryGoal: true,
  experienceLevel: true,
  trainingDaysPerWeek: true,
  trainingEnvironment: true,
  limitations: true,
  recommendedStructure: true,
  onboardingCompletedAt: true,
  timezone: true,
  locale: true,
  reminderHour: true,
  remindersEnabled: true
} as const;

export type PrismaUserRow = {
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
  onboardingCompletedAt: Date | null;
  timezone: string;
  locale: string;
  reminderHour: number;
  remindersEnabled: boolean;
};

export type SerializedProfile = Omit<PrismaUserRow, "onboardingCompletedAt"> & {
  onboardingCompletedAt: string | null;
  onboardingCompleted: boolean;
};

export function serializeProfile(user: PrismaUserRow): SerializedProfile {
  return {
    ...user,
    onboardingCompletedAt: user.onboardingCompletedAt ? user.onboardingCompletedAt.toISOString() : null,
    onboardingCompleted: Boolean(user.onboardingCompletedAt)
  };
}
