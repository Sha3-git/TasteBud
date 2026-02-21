import api from "./apiClient";

export const ingredientsService = {
  // Basic search (first page)
  search: (query: string, limit: number = 10) => {
    return api.get(`/ingredients/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },

  // Search with pagination (for "load more")
  searchWithSkip: (
    query: string, 
    limit: number = 10, 
    ingredientSkip: number = 0, 
    brandedSkip: number = 0
  ) => {
    return api.get(
      `/ingredients/search?q=${encodeURIComponent(query)}&limit=${limit}&ingredientSkip=${ingredientSkip}&brandedSkip=${brandedSkip}`
    );
  },

  // Search only base ingredients
  searchBase: (query: string, limit: number = 20, skip: number = 0) => {
    return api.get(`/ingredients/base?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
  },

  // Search only branded foods
  searchBranded: (query: string, limit: number = 20, skip: number = 0) => {
    return api.get(`/ingredients/branded?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
  },

  // Get single ingredient by ID
  getById: (id: string) => {
    return api.get(`/ingredients/${id}`);
  },
};