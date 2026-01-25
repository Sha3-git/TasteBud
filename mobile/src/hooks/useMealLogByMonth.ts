import { useState, useEffect, useCallback } from "react";
import { mealLogService } from "../services/mealLogService";
import { reactionService } from "../services/reactionService";

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
  monthLogs: MonthLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}


export function useMealLogByMonth(
  year: number,
  month: number,
): UseMealLogByDayReturn {
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

    const fetchDataSafe = async () => {
      if (!userId) {
        if (!isCancelled) setLoading(false);
        return;
      }

      if (!isCancelled) {
        setLoading(true);
        setError(null);
      }
       const tzOffset = new Date().getTimezoneOffset();

      try {
        const mealRes = await mealLogService.getMealLogByMonth({
          year,
          month,
          userId,
          tzOffset
        });
        if (isCancelled) return;

        const mealLogs = mealRes.data;
        console.log(mealLogs[0].meals[0].ingredients)

        const formattedMonthLogs: MonthLog[] = await Promise.all(
          mealLogs.map(async (dayGroup: any) => {
            const formattedMeals = await Promise.all(
              dayGroup.meals.map(async (meal: any) => {
                const reacRes = await reactionService.getReaction(meal.id);
                const reaction = reacRes.data;

                return {
                  id: meal.id,
                  name: meal.mealName,
                  time: new Date(meal.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  ingredients: meal.ingredients.map((i: any) => i.name),
                  symptoms:
                    reaction?.symptoms?.map((r: any) => ({
                      name: r.symptom.name,
                      severity: r.severity ?? 0,
                      time: new Date(reaction.createdAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      ),
                    })) || [],
                  unsafeIngredients: meal.ingredients
                    .filter((i: any) => i.allergens?.length > 0)
                    .map((i: any) => i.name),
                  color: reaction?.symptoms?.length ? "#FFA07A" : "#22C55E",
                };
              }),
            );

            return {
              date: new Date(dayGroup.date + "T00:00:00"),
              dayName: dayGroup.dayName,
              dayNumber: dayGroup.dayNumber,
              meals: formattedMeals,
              isExpanded: dayGroup.isExpanded,
            };
          }),
        );

        setMonthLogs(formattedMonthLogs);


        

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
    monthLogs,
    loading,
    error,
    refetch,
  };
}
