/**
 * Rule-based fatigue detection.
 *
 * MVP signals (intentionally conservative — false positives undermine trust):
 *  1. high_fatigue_streak — last N completed sessions all had perceivedFatigue >= 8
 *  2. rir_dropping        — across recent sessions of the SAME slot, RIR
 *                           dropped while weight stayed equal or increased
 *                           (the lift is feeling harder, not easier)
 *
 * Returns { status, reasons[] } so the frontend can render an explanation
 * with the same translation pattern used everywhere else.
 */

export interface RecentSession {
  id: string;
  completedAt: Date;
  perceivedFatigue: number | null;
  /** Per-exercise best set summary used for signal 2. */
  bestSets: { slotName: string; weight: number | null; rir: number | null }[];
}

export interface FatigueReason {
  key: string;
  params?: Record<string, string | number>;
}

export interface FatigueStatus {
  status: "ok" | "elevated";
  reasons: FatigueReason[];
}

const HIGH_FATIGUE_THRESHOLD = 8;
const HIGH_FATIGUE_STREAK_REQUIRED = 3;

export function detectFatigue(sessions: RecentSession[]): FatigueStatus {
  const reasons: FatigueReason[] = [];

  // Signal 1: high perceivedFatigue streak
  const lastN = sessions
    .filter((s) => s.perceivedFatigue !== null)
    .slice(0, HIGH_FATIGUE_STREAK_REQUIRED);
  if (
    lastN.length >= HIGH_FATIGUE_STREAK_REQUIRED &&
    lastN.every((s) => (s.perceivedFatigue ?? 0) >= HIGH_FATIGUE_THRESHOLD)
  ) {
    reasons.push({
      key: "fatigue.high_fatigue_streak",
      params: { n: HIGH_FATIGUE_STREAK_REQUIRED }
    });
  }

  // Signal 2: RIR dropping at same/heavier weight for the same slot across the
  // most recent 3 sessions where that slot appears.
  const slotsToSessions = new Map<string, RecentSession[]>();
  for (const session of sessions) {
    for (const best of session.bestSets) {
      if (!slotsToSessions.has(best.slotName)) {
        slotsToSessions.set(best.slotName, []);
      }
      slotsToSessions.get(best.slotName)!.push(session);
    }
  }

  for (const [slotName, slotSessions] of slotsToSessions) {
    if (slotSessions.length < 3) continue;
    // sessions[0] is most recent (sorted by completedAt desc upstream).
    // Pull each session's best-set entry for this slot.
    const points = slotSessions.slice(0, 3).map((s) => {
      const best = s.bestSets.find((b) => b.slotName === slotName);
      return { weight: best?.weight ?? null, rir: best?.rir ?? null };
    });
    if (points.some((p) => p.rir === null)) continue;

    // From oldest -> newest: rir falling, weight non-decreasing.
    const [newest, mid, oldest] = points;
    const weightsNonDecreasing =
      (newest.weight ?? 0) >= (mid.weight ?? 0) && (mid.weight ?? 0) >= (oldest.weight ?? 0);
    const rirDropping = (newest.rir ?? 0) < (mid.rir ?? 0) && (mid.rir ?? 0) < (oldest.rir ?? 0);
    if (weightsNonDecreasing && rirDropping) {
      reasons.push({
        key: "fatigue.rir_dropping",
        params: { slot: slotName }
      });
      break; // one example is enough for the banner
    }
  }

  return {
    status: reasons.length > 0 ? "elevated" : "ok",
    reasons
  };
}
