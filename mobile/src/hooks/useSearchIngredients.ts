import { ingredientsService } from "../services/ingredientsService";
import { useState, useEffect, use } from "react";
export function useSearchIngredients(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const limit = 5;
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const result = await ingredientsService.search(query, limit);
      console.log("result");
      console.log(result.data);
      if (result.status == 200 && result.data) {
        setResults(result.data);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);
  return results;
}
