import api from "./apiClient";

export const brandedFoodService = {
  // Search branded food products
  search: (q: string, limit: number = 5) => {
    return api.get("/brandedfood/search", {
      params: { q, limit },
    });
  },
  // Get mapped ingredients for a branded food
  getIngredients: (brandedFoodId: string) => {
    return api.get(`/brandedfood/ingredients/${brandedFoodId}`);
  },
};