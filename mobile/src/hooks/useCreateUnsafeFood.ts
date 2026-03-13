import { useState } from "react";
import { unsafeFoodsService } from "../services/unsafeFoodsService";

const userId = "69173dd5a3866b85b59d9760";

export function useCreateUnsafeFood() {
  const [saving, setSaving] = useState(false);

  const addUnsafeFood = async (ingredientId: string, isSafe: boolean) => {
    setSaving(true);

    try {
      const response = await unsafeFoodsService.createUnsafeFood( {
        ingredient: ingredientId,
        status: isSafe ? "safe" : "confirmed",
        preExisting: false,
      });

      return response.data;
    } finally {
      setSaving(false);
    }
  };

  return {
    addUnsafeFood,
    saving,
  };
}
