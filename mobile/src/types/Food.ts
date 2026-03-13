export interface Food {
  id: string;
  name: string;
  category: string;
  isSafe: boolean;
  status?: 'confirmed' | 'suspected';
  preExisting?: boolean;
  track?: 'ige_allergy' | 'fodmap' | 'intolerance';
  trackLabel?: string;
  confidence?: 'low' | 'moderate' | 'high' | 'very_high';
  reactionRate?: number;
  avgSeverity?: number;
  avgHoursToReaction?: number;
  totalMeals?: number;
  reactionMeals?: number;
  recommendation?: string;
}
