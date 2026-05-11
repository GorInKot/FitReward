const ACHIEVEMENTS = [
  {
    id: "first_workout",
    name: "Первая тренировка",
    description: "Завершите свою первую тренировку",
    reward: 10,
    condition: { workoutCount: 1 }
  },
  {
    id: "week_streak",
    name: "Неделя в режиме",
    description: "Тренируйтесь 7 дней подряд",
    reward: 50,
    condition: { streakDays: 7 }
  }
];

export async function checkAchievements(_userId: string) {
  return ACHIEVEMENTS;
}
