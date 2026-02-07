import api from "./apiClient";

export interface UnsafeFoodIngredient {
  ingredient: {
    _id: string;
    name: string;
    foodGroup: string;
    foodSubgroup?: string;
    allergens?: string[];
  };
  status: "confirmed" | "suspected";
  preExisting: boolean;
  _id: string;
}

export interface UnsafeFoodsResponse {
  _id: string;
  userId: string;
  ingredients: UnsafeFoodIngredient[];
}

export const unsafeFoodsService = {
  getUnsafeFoods: (userId: string) => {
    return api.get<UnsafeFoodsResponse>("/unsafefood/get", {
      params: { userId }
    });
  },
  
  createUnsafeFood: (userId: string, data: {
    ingredient: string;
    status: string;
    preExisting: boolean;
  }) => {
    return api.post("/unsafefood/create", data, {
      params: { userId }
    });
  },
  
  deleteUnsafeFood: (id: string, ingredientId: string) => {
    return api.delete(`/unsafefood/delete/${id}`, {
      data: { ingredient: ingredientId }
    });
  }
};
