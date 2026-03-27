import api from "./apiClient";
export const userService = {
  getMonthlyReport: ( year: number, month: number) => {
    return api.get("/user/report", {
      params: {year, month },
    });
  }

}