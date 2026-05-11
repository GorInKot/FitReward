interface PlanRequest {
  fitnessLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  goals: string[];
  availableTime: number;
  daysPerWeek: number;
}

export function generateAIPlan(request: PlanRequest) {
  const workoutsPerWeek = Math.max(2, Math.min(request.daysPerWeek, 6));
  return {
    id: "mvp-plan",
    name: `${request.fitnessLevel} Plan`,
    duration: 4,
    workoutsPerWeek,
    targetGoal: request.goals[0] ?? "GENERAL_FITNESS",
    exercises: [],
    aiGenerated: false
  };
}
