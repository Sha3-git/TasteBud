import { useState, useEffect, useCallback } from "react";
import { reactionService, MonthlyAnalysis } from "../services/reactionService";

interface Trigger {
  food: string;
  count: number;
  emoji: string;
}

interface TopTrigger {
  food: string;
  appearances: number;
  avgSeverity: number;
  emoji: string;
}

const userId = "69173dd5a3866b85b59d9760";

export function useAnalysis() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topTriggers, setTopTriggers] = useState<Trigger[]>([]);
  const [topTrigger, setTopTrigger] = useState<TopTrigger | null>(null);
  const [monthlyAnalysis, setMonthlyAnalysis] = useState<MonthlyAnalysis | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current month/year
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // 1-indexed

      // Fetch top trigger foods
      const reacRes = await reactionService.getTopTriggerFoods(userId);
      const triggers = reacRes.data;
      
      // Check if triggers array exists AND has items
      if (triggers && Array.isArray(triggers) && triggers.length > 0) {
        const top: TopTrigger = {
          food: triggers[0].ingredient,
          appearances: triggers[0].reactionMeals,
          avgSeverity: Math.round((triggers[0].avgSeverity || 0) * 10) / 10,
          emoji: "",
        };
        setTopTrigger(top);

        const formattedRes = triggers.map((t: any) => ({
          food: t.ingredient,
          count: t.reactionMeals,
          emoji: "",
        }));
        setTopTriggers(formattedRes);
      } else {
        setTopTrigger(null);
        setTopTriggers([]);
      }

      // Fetch monthly analysis
      const analysisRes = await reactionService.getMonthlyAnalysis(userId, year, month);
      if (analysisRes.data) {
        setMonthlyAnalysis(analysisRes.data);
      }

    } catch (err: any) {
      console.error("Failed to fetch analysis data:", err);
      setError(err.message || "Failed to fetch analysis data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    topTrigger,
    topTriggers,
    monthlyAnalysis,
    loading,
    error,
    refetch: fetchData,
  };
}
