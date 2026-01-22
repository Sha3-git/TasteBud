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

export interface Meal {
  id: string;
  name: string;
  time: string;
  ingredients: string[];
  symptoms: { id: string; name: string; severity: number; time: string }[];
  unsafeIngredients: string[];
  color: string;
}

export interface MonthLog {
  date: Date;
  dayName: string;
  dayNumber: number;
  meals: Meal[];
  isExpanded: boolean;
}

interface UseMealLogByDayReturn {
  stats: Stats;
  monthLogs: MonthLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMealLogByMonth(
  year: number,
  month: number,
): UseMealLogByDayReturn {
  const [stats, setStats] = useState<Stats>({
    mealCount: 0,
    reacCount: 0,
    unsafeFoodsCount: 0,
    crossReactiveCount: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    caloriesKcal: 0,
  });
  const [monthLogs, setMonthLogs] = useState<MonthLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = "69173dd5a3866b85b59d9760";

  const [refreshCounter, setRefreshCounter] = useState(0);

  const refetch = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const date = "2026-01-18";

    const fetchDataSafe = async () => {
      if (!date || !userId) {
        if (!isCancelled) setLoading(false);
        return;
      }

      if (!isCancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        const mealRes = await mealLogService.getMealLogByMonth({
          year,
          month,
          userId,
        });
        if (isCancelled) return;

        const mealLogs = mealRes.data;

        setStats((prev) => ({
          ...prev,
          mealCount: mealLogs.length,
          reacCount: 0,
        }));

        const meals: Meal[] = [];

        for (const log of mealLogs) {
          const reacRes = await reactionService.getReaction(log._id);
          const reaction = reacRes.data;

          meals.push({
            id: log._id,
            name: log.mealName,
            time: new Date(log.created).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            ingredients: log.ingredients.map((i: any) => i.name),
            symptoms:
              reaction?.symptoms?.map((r: any) => ({
                name: r.symptom.name,
                severity: r.severity ?? 0,
                time: new Date(reaction.created).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })) || [],
            unsafeIngredients: log.ingredients
              .filter((i: any) => i.allergens?.length > 0)
              .map((i: any) => i.name),
            color: reaction?.symptoms?.length ? "#FFA07A" : "#22C55E",
          });
        }

        // Group by local date as YYYY-MM-DD
        const groupedByDay: Record<string, Meal[]> = {};

        meals.forEach((meal) => {
          const log = mealLogs.find((l: any) => l._id === meal.id);
          const localDate = new Date(log.created); // UTC -> local automatically
          const dayKey = `${localDate.getFullYear()}-${(
            localDate.getMonth() + 1
          )
            .toString()
            .padStart(
              2,
              "0",
            )}-${localDate.getDate().toString().padStart(2, "0")}`;

          if (!groupedByDay[dayKey]) groupedByDay[dayKey] = [];
          groupedByDay[dayKey].push(meal);
        });

        const monthlyLogs: MonthLog[] = Object.keys(groupedByDay).map(
          (dayKey) => {
            const [year, month, day] = dayKey.split("-").map(Number);
            const dayDate = new Date(year, month - 1, day);
            return {
              date: dayDate,
              dayName: dayDate
                .toLocaleString("en-US", { weekday: "short" })
                .toUpperCase(),
              dayNumber: dayDate.getDate(),
              meals: groupedByDay[dayKey],
              isExpanded: true,
            };
          },
        );

        setMonthLogs(monthlyLogs);

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
  }, [year, month, userId, refreshCounter]);

  return {
    stats,
    monthLogs,
    loading,
    error,
    refetch,
  };
}
