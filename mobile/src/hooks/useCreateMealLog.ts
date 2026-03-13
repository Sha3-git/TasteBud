import { mealLogService } from "../services/mealLogService";


export function useCreateMealLog() {
  const createMealLog = async (
    date: Date,
    mealName: string,
    ingredientIds: Array<string>,
    _ingredientNames: Array<string>,  // Kept for compatibility but not sent
    hadReaction: Boolean
  ) => {
    const MealLog = {
      mealName,
      ingredients: ingredientIds,  
      hadReaction,
      date,
    };
    
    const response = await mealLogService.createMealLog(MealLog);
    return response.data;
  };

  const updateMealLog = async (
    mealId: string,
    mealName: string,
    ingredientIds: Array<string>,
    _ingredientNames: Array<string>,  
    hadReaction: Boolean
  ) => {
    const updates = {
      mealName,
      ingredients: ingredientIds,  
      hadReaction,
    };
    
    const response = await mealLogService.updateMealLog(mealId, updates);
    return response.data;
  };

  return {
    createMealLog,
    updateMealLog,
  };
}