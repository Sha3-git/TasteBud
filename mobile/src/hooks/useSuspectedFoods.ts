import { useState, useEffect, useCallback } from 'react';
import api from '../services/apiClient';

interface SuspectedFood {
  id: string;
  ingredientId: string;
  ingredient: string;
  ingredientName: string;
  track: 'ige_allergy' | 'fodmap' | 'intolerance';
  trackLabel: string;
  confidence: 'low' | 'moderate' | 'high' | 'very_high';
  totalMeals: number;
  reactionMeals: number;
  nonReactionMeals: number;
  reactionRate: number;
  avgSeverity: number;
  suspicionScore: number;
  avgHoursToReaction: number;
  recommendation: string;
  // Track-specific fields
  multiSystemEvents?: number;
  isFODMAPTagged?: boolean;
  hasMajorAllergen?: boolean;
}

export function useSuspectedFoods() {
  // TODO: Replace with real userId from auth context when ready
  const userId = "69173dd5a3866b85b59d9760";
  
  const [data, setData] = useState<SuspectedFood[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuspectedFoods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/reactions/sus?userId=${userId}`);
      
      if (response.status === 200) {
        setData(response.data || []);
      } else {
        setError('Failed to fetch suspected foods');
      }
    } catch (err: any) {
      console.error('Error fetching suspected foods:', err);
      setError(err.message || 'Failed to fetch suspected foods');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSuspectedFoods();
  }, [fetchSuspectedFoods]);

  const refetch = () => {
    fetchSuspectedFoods();
  };

  return { data, isLoading, error, refetch };
}