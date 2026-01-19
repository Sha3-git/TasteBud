import { reactionService } from "../services/reactionService";
import { useState, useEffect } from "react";
interface Symptom {
  symptom: string;
  severity: number;
}
export function useCreateReaction(mealLogId: string, symptoms:Array<Symptom>){
    const userId = "69173dd5a3866b85b59d9760";
    const [reactionLog, setReactionLog] = useState<any>()
    
    useEffect(()=>{
        const fetch = async()=>{
            const reactionLog = {
                userId,
                mealLogId,
                symptoms
            }
            const reactionRes = await reactionService.createReaction(reactionLog)
            setReactionLog(reactionRes)
        }
    }, [mealLogId])
}