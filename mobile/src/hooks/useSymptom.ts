import { useState, useEffect, use } from "react";
import { symptomService } from "../services/symptomService";

export function useSearchSymptom(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const limit = 5;
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const result = await symptomService.search(query, limit);
      if (result.status == 200 && result.data) {
        setResults(result.data);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);
  return results;
}
