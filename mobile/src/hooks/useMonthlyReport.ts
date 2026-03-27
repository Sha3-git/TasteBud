import { useState } from "react";
import { userService } from "../services/userService";

export function useMonthlyReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);

  const getMonthlyReport = async (year: number, month: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getMonthlyReport(year, month);
      setReport(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch monthly report");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getMonthlyReport,
    report,
    loading,
    error,
  };
}