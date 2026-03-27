import { useState } from "react";
import { unsafeFoodsService } from "../services/unsafeFoodsService";


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
