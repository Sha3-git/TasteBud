import api from "./apiClient";

export const symptomService = {
    search: (q: string, limit: Number) =>{
        return api.get("/symptoms/search", {
      params: { q, limit },
    })
    }
}