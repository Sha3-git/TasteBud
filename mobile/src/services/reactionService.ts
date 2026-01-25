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
  userId: string;
  mealLogId: string;
  symptoms: Array<Symptom>;
}
// send the userID via authentication bearer token

export const reactionService = {
  getReactionByDay: (params: ReacParam) => {
    const { userId, date, page = 1, limit = 10 } = params;

    return api.get("/reactions/daily", {
      params: { userId, date, page, limit },
    });
  },
  getdailyReactionCount: (params: ReacParam) => {
    const { userId, date, tzOffset } = params;
    return api.get("/reactions/stats", {
      params: { userId, date, tzOffset },
    });
  },
  getTopTriggerFoods: (userId: string) => {
    return api.get("/reactions/sus", {
      params: { userId },
    });
  },
  createReaction: (params: Reaction) => {
    return api.post("/reactions/create", params, {
      params: { userId: params.userId },
    });
  },
  getReaction: (mealLogId: string) => {
    return api.get("reactions/", { params: { mealLogId: mealLogId } });
  },
};
