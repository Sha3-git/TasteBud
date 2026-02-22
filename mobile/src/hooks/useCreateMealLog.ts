import { mealLogService } from "../services/mealLogService";

const userId = "69173dd5a3866b85b59d9760";

export function useCreateMealLog() {
  // Create a new meal log
  // Sends ingredient IDs only - backend resolves names on read
  const createMealLog = async (
    date: Date,
    mealName: string,
    ingredientIds: Array<string>,
    _ingredientNames: Array<string>,  // Kept for compatibility but not sent
    hadReaction: Boolean
  ) => {
    const MealLog = {
      userId,
      mealName,
      ingredients: ingredientIds,  // Just IDs - backend resolves names
      hadReaction,
      date,
    };
    
    console.log("📝 Creating meal:", JSON.stringify(MealLog));
    const response = await mealLogService.createMealLog(MealLog);
    return response.data;
  };

  // Update an existing meal log
  const updateMealLog = async (
    mealId: string,
    mealName: string,
    ingredientIds: Array<string>,
    _ingredientNames: Array<string>,  // Kept for compatibility but not sent
    hadReaction: Boolean
  ) => {
    const updates = {
      mealName,
      ingredients: ingredientIds,  // Just IDs - backend resolves names
      hadReaction,
    };
    
    console.log("✏️ Updating meal " + mealId + ":", JSON.stringify(updates));
    const response = await mealLogService.updateMealLog(mealId, updates);
    return response.data;
  };

  return {
    createMealLog,
    updateMealLog,
  };
}