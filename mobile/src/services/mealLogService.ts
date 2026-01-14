import api from "./apiClient";

interface MealParam {
  userId: string;
  date?: string;   
  page?: number;
  limit?: number;
}
// send the userID via authentication bearer token

export const mealLogService = {
  getMealLogByDay: (params: MealParam) => {
    const { userId, date, page = 1, limit = 10 } = params;
    
    return api.get("/meallogs/daily", {
      params: { userId, date, page, limit },
    });
  },
  getMealLogByWeek: (params: MealParam) => {
    const { userId, date, page = 1, limit = 10 } = params;
    
    return api.get("/meallogs/weekly", {
      params: { userId, date, page, limit },
    });
  },
};
