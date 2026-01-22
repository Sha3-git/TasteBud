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
export function useCreateMealLog() {
  const createMealLog = async (
    date: Date,
    mealName: string,
    ingredients: Array<string>,
    hadReaction: Boolean
  ) => {
    const MealLog = {
      userId,
      mealName: mealName,
      ingredients: ingredients,
      hadReaction: hadReaction,
      date: date,
    };
    console.log("from create Meal log meal payload| " + JSON.stringify(MealLog))
    const response = await mealLogService.createMealLog(MealLog);
    return response.data;
  };
  return{
    createMealLog
  }
}
