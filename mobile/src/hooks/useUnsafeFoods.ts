import { useState, useEffect, useCallback } from "react";
import { unsafeFoodsService, UnsafeFoodsResponse } from "../services/unsafeFoodsService";

export function useUnsafeFoods() {
  // TODO: Replace with real userId from auth context when ready
  const userId = "69173dd5a3866b85b59d9760";
  
  const [data, setData] = useState<UnsafeFoodsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnsafeFoods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await unsafeFoodsService.getUnsafeFoods(userId);
      setData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch unsafe foods:", err);
      setError(err.message || "Failed to fetch unsafe foods");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUnsafeFoods();
  }, [fetchUnsafeFoods]);

  const refetch = () => {
    fetchUnsafeFoods();
  };

  return { data, isLoading, error, refetch };
}
