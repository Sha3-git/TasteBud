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
  symptoms: { name: string; severity: number; time: string }[];
  unsafeIngredients: string[];
  color: string;
}

export interface DayLog {
  date: Date;
  dayName: string;
  dayNumber: number;
  meals: Meal[];
  isExpanded: boolean;
}

interface UseMealLogByDayReturn {
  stats: Stats;
  dayLogs: DayLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function getMealLogByDay(date: string): UseMealLogByDayReturn {


  const [stats, setStats] = useState<Stats>({
    mealCount: 0,
    reacCount: 0,
    unsafeFoodsCount: 0,
    crossReactiveCount: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    caloriesKcal: 0,
  });
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = "69173dd5a3866b85b59d9760";
  
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const refetch = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
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

      try {

        const [mealRes, reacRes] = await Promise.all([
          mealLogService.getMealLogByDay({ date, userId }),
          reactionService.getReactionByDay({ date, userId }),
        ]);

        if (isCancelled) return;

        const mealLogs = mealRes.data;
        const reactions = reacRes.data;

        setStats(prev => ({
          ...prev,
          mealCount: mealLogs.length,
          reacCount: reactions.length,
        }));

        const meals: Meal[] = mealLogs.map((log: any) => ({
          id: log._id,
          name: log.mealName,
          time: new Date(log.created).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          ingredients: log.ingredients.map((i: any) => i.name),
          symptoms:
            log.reaction?.map((r: any) => ({
              name: r.symptom,
              severity: r.severity ?? 0,
              time: new Date(r.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })) || [],
          unsafeIngredients: log.ingredients
            .filter((i: any) => i.allergens?.length > 0)
            .map((i: any) => i.name),
          color: "#FFA07A",
        }));

        const dateObj = new Date(date);
        const dailyLog: DayLog = {
          date: dateObj,
          dayName: dateObj.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
          dayNumber: dateObj.getDate(),
          isExpanded: true,
          meals,
        };

        setDayLogs([dailyLog]);
        setError(null);

      } catch (err) {
        if (isCancelled) return;

        console.error("Failed to fetch meal log data:", err);

        if (err instanceof Error) {
          if (err.message.includes("Network")) {
            setError("Unable to connect. Please check your internet connection.");
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
    dayLogs,
    loading,
    error,
    refetch,
  };
}