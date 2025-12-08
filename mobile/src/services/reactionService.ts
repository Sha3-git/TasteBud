import api from "./apiClient";

interface ReacParam {
  userId: string;
  date?: string;   
  page?: number;
  limit?: number;
}
// send the userID via authentication bearer token

export const reactionService = {
  getReactionByDay: (params: ReacParam) => {
    const { userId, date, page = 1, limit = 10 } = params;
    
    return api.get("/reactions/daily", {
      params: { userId, date, page, limit },
    });
  },
};