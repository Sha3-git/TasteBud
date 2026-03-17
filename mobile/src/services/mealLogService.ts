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
  mealName: string;
  ingredients: Array<string>;
  hadReaction: Boolean;
  date: Date;
}


export const mealLogService = {
  getMealLogByDay: (params: MealParam) => {
    const {date, page = 1, limit = 10, tzOffset } = params;

    return api.get("/meallogs/daily", {
      params: {date, page, limit, tzOffset },
    });
  },

  getMealLogByWeek: (params: MealParam) => {
    const {date, page = 1, limit = 10 } = params;

    return api.get("/meallogs/weekly", {
      params: {date, page, limit },
    });
  },

  getMealLogByMonth: (params: MealParam) => {
    const {year, month, page = 1, limit = 100, tzOffset } = params;

    return api.get("/meallogs/monthly", {
      params: {year, month, page, limit, tzOffset },
    });
  },

  getDailyMealLogCount: (params: MealParam) => {
    const {date, tzOffset } = params;
    return api.get("/meallogs/stats", {
      params: {date, tzOffset },
    });
  },

  createMealLog: (params: MealLog) => {
    return api.post("/meallogs/create", params, {
    });
  },

  // NEW: Update an existing meal log
  updateMealLog: (mealId: string, updates: { mealName?: string; ingredients?: Array<string>; hadReaction?: Boolean }) => {
    return api.put(`/meallogs/update/${mealId}`, updates);
  },

  // NEW: Delete a meal log  
  deleteMealLog: (mealId: string) => {
    return api.delete(`/meallogs/delete/${mealId}`);
  },
};