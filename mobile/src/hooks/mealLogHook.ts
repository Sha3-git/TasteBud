import { useState, useEffect } from "react";
import { mealLogService } from "../services/mealLogService";
import { reactionService } from "../services/reactionService";

interface Stats {
  mealCount: number;
  reacCount: number;
  unsafeFoodsCount: number;
  crossReactiveCount: number;
  proteinGrams: number;
  carbsGrams: number;
  caloriesKcal: number;
}

export function getMealLogStats(date: string, userId: string) {
  const [stats, setStats] = useState<Stats>({
    mealCount: 0,
    reacCount: 0,
    unsafeFoodsCount: 0,
    crossReactiveCount: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    caloriesKcal: 0,
  });

  useEffect(() => {
    const getMealData = async () => {
      try {
        //const today = new Date().toISOString().split("T")[0];
        const today = "2025-12-07";


        const mealRes = await mealLogService.getMealLogByDay({ date: today, userId });
        const mealLogs = mealRes.data;

        const reacRes = await reactionService.getReactionByDay({ date: today, userId });
        const reactions = reacRes.data;
        console.log(reactions)

        setStats(prev => ({
          ...prev,
          mealCount: mealLogs.length,
          reacCount: reactions.length
        }));
      } catch (err) {
        console.error("Failed to fetch daily meals", err);
      }
    };
    

    getMealData();
  }, [date]);

  return stats;
}
