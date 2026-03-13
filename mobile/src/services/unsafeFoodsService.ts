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
  ingredients: UnsafeFoodIngredient[];
}

export const unsafeFoodsService = {
  getUnsafeFoods: () => {
    return api.get<UnsafeFoodsResponse>("/unsafefood/get", {
    });
  },
  
  createUnsafeFood: (data: {
    ingredient: string;
    status: string;
    preExisting: boolean;
  }) => {
    return api.post("/unsafefood/create", data, {
    });
  },
  
  deleteUnsafeFood: (id: string, ingredientId: string) => {
    return api.delete(`/unsafefood/delete/${id}`, {
      data: { ingredient: ingredientId }
    });
  }
};
