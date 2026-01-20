import { reactionService } from "../services/reactionService";
import { useState, useEffect } from "react";
interface Symptom {
  symptom: string;
  severity: number;
}
export function useCreateReaction() {
  const createReaction = async (
    mealLogId: string,
    symptoms: Array<Symptom>,
  ) => {
    const userId = "69173dd5a3866b85b59d9760";
    console.log("reached hook");
      const reactionLog = {
        userId,
        mealLogId,
        symptoms,
      };
      const reactionRes = await reactionService.createReaction(reactionLog);
    return reactionRes.data;
  };
  return{
    createReaction
  }
}
