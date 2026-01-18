import { useState, useEffect, useCallback } from "react";
import { mealLogService } from "../services/mealLogService";
import { reactionService } from "../services/reactionService";

interface Meal {
  id: string;
  name: string;
  time: string;
  ingredients: string[];
  symptoms: { name: string; severity: number; time: string }[];
  unsafeIngredients: string[];
  color: string;
}

const userId = "69173dd5a3866b85b59d9760";
export function createMealLog(
  date: Date,
  mealName: string,
  ingredients: Array<string>,
) {
  const MealLog = {
    userId,
    mealName: mealName,
    ingredients: [],
    hadReaction: false,
    date: date,
  };
  mealLogService.createMealLog(MealLog);
  return true;
}
