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
    console.log("reached hook");
      const reactionLog = {
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
