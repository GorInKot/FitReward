export type FitnessLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface User {
  id: string;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  fitnessLevel: FitnessLevel;
}
