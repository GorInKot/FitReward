/**
 * Rule-based adaptive progression.
 *
 * Inputs:
 *   - lastSet: the heaviest/best set the user logged for this exercise across
 *     their last completed session
 *   - targetRepsLow/High: prescribed range for the current program
 *
 * Output:
 *   - suggestedWeight (or null if last set had no weight — bodyweight movement)
 *   - suggestedReps  (mid of range, or pushed up if user has room)
 *   - rationaleKey   (translation key the frontend uses to explain the bump)
 */

export interface ProgressionInput {
  lastWeight: number | null;
  lastReps: number;
  lastRir: number | null;
  targetRepsLow: number;
  targetRepsHigh: number;
}

export interface ProgressionSuggestion {
  suggestedWeight: number | null;
  suggestedReps: number;
  rationaleKey: string;
}

function roundToHalf(weight: number): number {
  return Math.round(weight * 2) / 2;
}

export function nextSuggestion(input: ProgressionInput): ProgressionSuggestion {
  const { lastWeight, lastReps, lastRir, targetRepsLow, targetRepsHigh } = input;

  // No prior log → fall back to range midpoint, keep whatever weight (or null).
  if (lastWeight === null && lastReps === 0) {
    const mid = Math.round((targetRepsLow + targetRepsHigh) / 2);
    return { suggestedWeight: null, suggestedReps: mid, rationaleKey: "progression.first_time" };
  }

  // No RIR recorded — be conservative, repeat last performance.
  if (lastRir === null) {
    return {
      suggestedWeight: lastWeight,
      suggestedReps: lastReps,
      rationaleKey: "progression.repeat_last"
    };
  }

  // RIR >= 5 sentinel "too easy" → bigger jump.
  if (lastRir >= 5) {
    const bump = lastWeight !== null ? roundToHalf(lastWeight * 1.075) : null;
    return {
      suggestedWeight: bump,
      suggestedReps: lastReps,
      rationaleKey: "progression.too_easy"
    };
  }

  // RIR >= 3: noticeable room → +2.5-5% (use 3%)
  if (lastRir >= 3) {
    const bump = lastWeight !== null ? roundToHalf(lastWeight * 1.03) : null;
    return {
      suggestedWeight: bump,
      suggestedReps: lastReps,
      rationaleKey: "progression.add_weight"
    };
  }

  // RIR 0-1: very hard → don't bump weight, push reps if below high end
  if (lastRir <= 1) {
    if (lastReps < targetRepsHigh) {
      return {
        suggestedWeight: lastWeight,
        suggestedReps: lastReps + 1,
        rationaleKey: "progression.push_reps"
      };
    }
    // At top of range with RIR 0-1: small weight bump
    const bump = lastWeight !== null ? roundToHalf(lastWeight * 1.025) : null;
    return {
      suggestedWeight: bump,
      suggestedReps: targetRepsLow,
      rationaleKey: "progression.double_progression"
    };
  }

  // RIR 2: sweet spot → hold weight, hold reps
  return {
    suggestedWeight: lastWeight,
    suggestedReps: lastReps,
    rationaleKey: "progression.hold"
  };
}
