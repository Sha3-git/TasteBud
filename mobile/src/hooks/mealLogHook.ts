import { useState, useEffect } from "react";
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

export function getMealLogData(date: string, userId: string) {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mealRes = await mealLogService.getMealLogByDay({ date, userId });
        const mealLogs = mealRes.data;

        const reacRes = await reactionService.getReactionByDay({ date, userId });
        const reactions = reacRes.data;

        console.log(reactions)

        setStats(prev => ({
          ...prev,
          mealCount: mealLogs.length,
          reacCount: reactions.length,
        }));

        const meals: Meal[] = mealLogs.map((log: any) => ({
          id: log._id,
          name: log.mealName,
          time: new Date(log.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          ingredients: log.ingredients.map((i: any) => i.name),
          symptoms: log.reaction?.map((r: any) => ({
            name: r.symptom,
            severity: r.severity ?? 0,
            time: new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
      } catch (err) {
        console.error("Failed to fetch meal log data", err);
      }
    };

    fetchData();
  }, [date, userId]);

  return { stats, dayLogs };
}
