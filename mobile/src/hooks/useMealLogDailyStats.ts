import { useState, useEffect, useCallback } from "react";
import { mealLogService } from "../services/mealLogService";
import { reactionService } from "../services/reactionService";

export interface Stats {
  mealCount: number;
  reacCount: number;
  unsafeFoodsCount: number;
  crossReactiveCount: number;
  proteinGrams: number;
  carbsGrams: number;
  caloriesKcal: number;
}

interface UseMealLogByDayReturn {
  stats: Stats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMealLogDailyStats(date: string): UseMealLogByDayReturn {
  const [stats, setStats] = useState<Stats>({
    mealCount: 0,
    reacCount: 0,
    unsafeFoodsCount: 0,
    crossReactiveCount: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    caloriesKcal: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = "69173dd5a3866b85b59d9760";

  const [refreshCounter, setRefreshCounter] = useState(0);
  console.log("From mealLogByDay| today's date: " + date);
  const refetch = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchDataSafe = async () => {
      if (!date || !userId) {
        if (!isCancelled) setLoading(false);
        return;
      }

      if (!isCancelled) {
        setLoading(true);
        setError(null);
      }
      const tzOffset = new Date().getTimezoneOffset();

      try {
        const mealRes = await mealLogService.getDailyMealLogCount({userId, date, tzOffset})
        const reacRes = await reactionService.getdailyReactionCount({userId, date, tzOffset})
        if (isCancelled) return;
         setStats(prevStats => ({
        ...prevStats,
        mealCount: mealRes.data.mealCount,
        reacCount: reacRes.data.reacCount
      }));

        setError(null);
      } catch (err) {
        if (isCancelled) return;

        console.error("Failed to fetch meal log data:", err);

        if (err instanceof Error) {
          if (err.message.includes("Network")) {
            setError(
              "Unable to connect. Please check your internet connection.",
            );
          } else {
            setError("Failed to load meal data. Please try again.");
          }
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchDataSafe();

    return () => {
      isCancelled = true;
    };
  }, [date, userId, refreshCounter]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
