"use client";

import type { MatchedTutor } from "@/services/smartMatch";
import { smartMatchService } from "@/services/smartMatch";
import { useCallback, useState } from "react";

export function useSmartMatch() {
  const [matches, setMatches] = useState<MatchedTutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMatches = useCallback(async (goal: string) => {
    if (!goal.trim() || goal.trim().length < 5) {
      setError("Learning goal must be at least 5 characters");
      setMatches([]);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await smartMatchService.findMatches(goal);

      if (result.success && result.data.recommendations) {
        setMatches(result.data.recommendations);
        return result;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to find matches";
      setError(errorMsg);
      setMatches([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMatches = useCallback(() => {
    setMatches([]);
    setError(null);
  }, []);

  return {
    matches,
    loading,
    error,
    findMatches,
    clearMatches,
  };
}
