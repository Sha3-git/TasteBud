import { useState, useEffect, useCallback } from "react";
import { mealLogService } from "../services/mealLogService";
import { reactionService } from "../services/reactionService";

interface Trigger {
  food: string;
  count: number;
  emoji: string;
}

interface TopTrigger{
    food: string,
    appearances: number,
    avgSeverity: number,
    emoji: string,
}
const userId = "69173dd5a3866b85b59d9760";
export function useAnalysis() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [topTriggers, setTopTriggers] = useState<Trigger[]>([]);
  const [topTrigger, setTopTrigger ] = useState<TopTrigger>()

  const getTopTriggerFoods = async () => {
    const reacRes = await reactionService.getTopTriggerFoods(userId);
    if(!reacRes.data) {
        setLoading(true)
        return
        
    }
    setLoading(false)
    const triggers = reacRes.data;
    const top = {
        food: triggers[0].ingredient,
        appearances: triggers[0].reactionMeals,
        avgSeverity: triggers[0].avgSeverity,
        emoji: ""
    }
    setTopTrigger(top)
    const formattedRes = triggers.map((t: any) => {
      return {
        food: t.ingredient,
        count: t.reactionMeals,
        emoji: "",
      };
    });
    console.log("from use analysis| " + JSON.stringify(formattedRes))
    setTopTriggers(formattedRes);
  };
  useEffect(() => {
    getTopTriggerFoods();
  }, []);
  return {
    topTrigger,
    topTriggers,
    loading
  };
}
