export function useProgress() {
  return {
    refresh: () => {
      console.log("refresh progress");
    }
  };
}
