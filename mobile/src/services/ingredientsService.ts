import api from "./apiClient";

export const ingredientsService = {
    search: (q: string, limit: Number) =>{
        return api.get("/ingredients/search", {
      params: { q, limit },
    })
    }
}