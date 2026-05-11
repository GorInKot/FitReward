export function useWorkout() {
  return {
    startWorkout: (workoutId: string) => {
      console.log(`start workout ${workoutId}`);
    }
  };
}
