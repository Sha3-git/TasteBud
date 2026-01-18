import api from "./apiClient";

interface MealParam {
  userId: string;
  date?: string;
  page?: number;
  limit?: number;
}

interface MealLog {
  userId: string;
  mealName: string;
  ingredients: Array<string>;
  hadReaction: Boolean
  date: Date;
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
  createMealLog: (params: MealLog) => {
    return (
      api.post("/meallogs/create",
      params,
      {
        params: { userId: params.userId },
      })
    );
  },
};
