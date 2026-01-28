import api from "./apiClient";

interface MealParam {
  userId: string;
  date?: string;
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
  tzOffset?: number;
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
    const { userId, date, page = 1, limit = 10, tzOffset } = params;

    return api.get("/meallogs/daily", {
      params: { userId, date, page, limit, tzOffset },
    });
  },
  
  getMealLogByWeek: (params: MealParam) => {
    const { userId, date, page = 1, limit = 10 } = params;

    return api.get("/meallogs/weekly", {
      params: { userId, date, page, limit },
    });
  },
  getMealLogByMonth: (params: MealParam) =>{
     const { userId, year, month, page = 1, limit = 100, tzOffset } = params;

    return api.get("/meallogs/monthly", {
      params: { userId, year, month, page, limit, tzOffset },
    });
  },
  getDailyMealLogCount: (params: MealParam) =>{
    const {userId, date, tzOffset} = params;
    return api.get("/meallogs/stats", {
      params: { userId, date, tzOffset},
    })
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
