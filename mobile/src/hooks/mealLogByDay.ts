/**
 * 
 * MEAL LOG BY DAY HOOK
 * 
 * 
 * WHY THIS FILE EXISTS:
 * This is a custom React hook that fetches and manages meal log data and 
 * we separate this from the UI components because:
 *   - It keeps data logic separate from display logic (clean architecture)
 *   - Can be reused across multiple screens (HomeScreen, MealLogScreen, etc.)
 *   - Makes testing easier so we can test data fetching independently
 *   - Single source of truth.. You fix a bug here, it's fixed everywhere.
 * 
 * WHAT IT DOES:
 *   1. Fetches meal logs for a specific day from the backend
 *   2. Fetches reactions/symptoms for that day
 *   3. Combines and transforms the data for the UI
 *   4. Handles loading, error, and success states
 *   5. Provides a refetch function to retry failed requests
 */

import { useState, useEffect, useCallback } from "react";
import { mealLogService } from "../services/mealLogService";
import { reactionService } from "../services/reactionService";

// TYPES
// --------------
// TypeScript interfaces define the shape of our data.
// This helps catch bugs early and gives us autocomplete in VS Code.

export interface Stats {
  mealCount: number;
  reacCount: number;
  unsafeFoodsCount: number;
  crossReactiveCount: number;
  proteinGrams: number;
  carbsGrams: number;
  caloriesKcal: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  ingredients: string[];
  symptoms: { name: string; severity: number; time: string }[];
  unsafeIngredients: string[];
  color: string;
}

export interface DayLog {
  date: Date;
  dayName: string;
  dayNumber: number;
  meals: Meal[];
  isExpanded: boolean;
}

interface UseMealLogByDayReturn {
  stats: Stats;
  dayLogs: DayLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// HOOK
// ------------------------
// Hooks are functions that let us "hook into" React features like state.
// This hook manages ALL the complexity of fetching meal data, so our
// UI components can stay simple and focused on displaying things.
// 
// USAGE IN A COMPONENT:
//   const { stats, dayLogs, loading, error, refetch } = getMealLogByDay(date, oduserId);
//   
//   if (loading) return <Spinner />;
//   if (error) return <ErrorMessage message={error} onRetry={refetch} />;
//   return <MealList meals={dayLogs} />;

export function getMealLogByDay(date: string, userId: string): UseMealLogByDayReturn {
  
  // STATE
  // -------------------
  // We track 4 things:
  //   - stats: summary numbers (meal count, reaction count, etc.)
  //   - dayLogs: the actual meal data to display
  //   - loading: true while fetching, false when done
  //   - error: null if OK, error message string if something failed

  const [stats, setStats] = useState<Stats>({
    mealCount: 0,
    reacCount: 0,
    unsafeFoodsCount: 0,
    crossReactiveCount: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    caloriesKcal: 0,
  });
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // REFETCH FUNCTION
  // ----------------------
  // A counter that triggers re-fetch when incremented.
  // Used by the "Try Again" button after errors.
  
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const refetch = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);


  // EFFECT
  // --------------
  // useEffect runs our fetch when the component mounts, and again whenever
  // date or userId changes. This keeps our data in sync automatically.
  // 
  // MEMORY LEAK PREVENTION:
  // We use an 'isCancelled' flag to prevent state updates after unmount.
  // If the user navigates away before the fetch completes, we simply
  // ignore the response instead of trying to update state on an
  // unmounted component (which causes React warnings).

  useEffect(() => {
    let isCancelled = false;

    const fetchDataSafe = async () => {
      // Don't fetch if we don't have required params
      if (!date || !userId) {
        if (!isCancelled) setLoading(false);
        return;
      }

      if (!isCancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        // Fetch meals and reactions in parallel for better performance
        const [mealRes, reacRes] = await Promise.all([
          mealLogService.getMealLogByDay({ date, userId }),
          reactionService.getReactionByDay({ date, userId }),
        ]);

        // If component unmounted, don't update state
        if (isCancelled) return;

        const mealLogs = mealRes.data;
        const reactions = reacRes.data;

        // Update stats
        setStats(prev => ({
          ...prev,
          mealCount: mealLogs.length,
          reacCount: reactions.length,
        }));

        // Transform meal data
        const meals: Meal[] = mealLogs.map((log: any) => ({
          id: log._id,
          name: log.mealName,
          time: new Date(log.created).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          ingredients: log.ingredients.map((i: any) => i.name),
          symptoms:
            log.reaction?.map((r: any) => ({
              name: r.symptom,
              severity: r.severity ?? 0,
              time: new Date(r.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })) || [],
          unsafeIngredients: log.ingredients
            .filter((i: any) => i.allergens?.length > 0)
            .map((i: any) => i.name),
          color: "#FFA07A",
        }));

        // Create the day log structure
        const dateObj = new Date(date);
        const dailyLog: DayLog = {
          date: dateObj,
          dayName: dateObj.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
          dayNumber: dateObj.getDate(),
          isExpanded: true,
          meals,
        };

        setDayLogs([dailyLog]);
        setError(null);

      } catch (err) {
        // If component unmounted, don't update state
        if (isCancelled) return;

        console.error("Failed to fetch meal log data:", err);

        if (err instanceof Error) {
          if (err.message.includes("Network")) {
            setError("Unable to connect. Please check your internet connection.");
          } else {
            setError("Failed to load meal data. Please try again.");
          }
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        // If component unmounted, don't update state
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchDataSafe();

    // Cleanup functionruns when component unmounts or dependencies change
    return () => {
      isCancelled = true;
    };
  }, [date, userId, refreshCounter]);

  // RETURN VALUE
  // ----------------
  // We return everything the UI might need:
  //   - stats & dayLogs: the actual data
  //   - loading: to show a spinner
  //   - error: to show an error message
  //   - refetch: to let users try again after an error

  return {
    stats,
    dayLogs,
    loading,
    error,
    refetch,
  };
}