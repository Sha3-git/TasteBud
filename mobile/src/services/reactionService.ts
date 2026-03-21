import api from "./apiClient";

interface ReacParam {
  userId: string;
  date?: string;
  page?: number;
  limit?: number;
  tzOffset?: number;
}

interface Symptom {
  symptom: string;
  severity: number;
}

interface Reaction {
  mealLogId: string;
  symptoms: Array<Symptom>;
}

export interface MonthlyAnalysis {
  monthlyImprovement: number;
  totalSymptoms: number;
  symptomFreeDays: number;
  weeklyTrend: { week: string; avgSeverity: number; reactionCount: number }[];
  timeOfDay: { breakfast: number; lunch: number; dinner: number };
  daysWithReactions: number;
  reactionCount: number;
}

export const reactionService = {
  getReactionByDay: (params: ReacParam) => {
    const {date, page = 1, limit = 10 } = params;
    return api.get("/reactions/daily", {
      params: {date, page, limit },
    });
  },
  
  getdailyReactionCount: (params: ReacParam) => {
    const {date, tzOffset } = params;
    return api.get("/reactions/stats", {
      params: {date, tzOffset },
    });
  },
  
  getTopTriggerFoods: (userId: string) => {
    return api.get("/analysis/suspected", {
      params: { userId },
    });
  },
  
  createReaction: (params: Reaction) => {
    return api.post("/reactions/create", params, {
    });
  },
  
  getReaction: (mealLogId: string) => {
    return api.get("reactions/", { params: { mealLogId: mealLogId } });
  },
  
  getMonthlyAnalysis: ( year: number, month: number) => {
    return api.get<MonthlyAnalysis>("/reactions/analysis", {
      params: {year, month },
    });
  },
};
