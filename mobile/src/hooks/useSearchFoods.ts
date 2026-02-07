import { useState, useEffect } from "react";
import { ingredientsService } from "../services/ingredientsService";
import { brandedFoodService } from "../services/brandedFoodService";

export interface IngredientResult {
  _id: string;
  name: string;
  type: "ingredient";
}

export interface BrandedFoodResult {
  _id: string;
  name: string;
  description: string;
  brandOwner: string;
  type: "branded";
}

export type FoodSearchResult = IngredientResult | BrandedFoodResult;

export interface CombinedSearchResults {
  ingredients: IngredientResult[];
  brandedFoods: BrandedFoodResult[];
  loading: boolean;
}

export function useSearchFoods(query: string): CombinedSearchResults {
  const [ingredients, setIngredients] = useState<IngredientResult[]>([]);
  const [brandedFoods, setBrandedFoods] = useState<BrandedFoodResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim() || query.length < 2) {
        setIngredients([]);
        setBrandedFoods([]);
        return;
      }

      setLoading(true);

      // Search ingredients FIRST (fast - local/Atlas DB)
      // This ensures user sees results quickly
      try {
        const ingredientRes = await ingredientsService.search(query, 15);
        if (ingredientRes.status === 200 && ingredientRes.data) {
          setIngredients(
            ingredientRes.data.map((item: any) => ({
              _id: item._id,
              name: item.name,
              type: "ingredient" as const,
            }))
          );
        } else {
          setIngredients([]);
        }
      } catch (error) {
        console.log("Ingredient search error (non-blocking):", error);
        setIngredients([]);
      }

      // Now we can stop showing "loading" since ingredients are ready
      setLoading(false);

      // Search branded foods IN BACKGROUND (slower - external DB)
      // Don't block UI - if it fails or times out, that's okay
      (async () => {
        try {
          const brandedPromise = brandedFoodService.search(query, 15);
          
          // Create a timeout promise (5 seconds max for branded search)
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Branded search timeout")), 5000);
          });

          // Race between the actual request and timeout
          const brandedRes = await Promise.race([brandedPromise, timeoutPromise]) as any;
          
          if (brandedRes?.status === 200 && brandedRes?.data?.results) {
            setBrandedFoods(
              brandedRes.data.results.map((item: any) => ({
                _id: item._id,
                name: item.description,
                description: item.description,
                brandOwner: item.brandOwner || "",
                type: "branded" as const,
              }))
            );
          } else {
            setBrandedFoods([]);
          }
        } catch (error) {
          // Branded search failed or timed out - that's okay, just show ingredients
          console.log("Branded search unavailable:", error);
          setBrandedFoods([]);
        }
      })();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return { ingredients, brandedFoods, loading };
}

// Helper hook to expand branded food to its mapped ingredients
export function useExpandBrandedFood() {
  const [loading, setLoading] = useState(false);

  const expandBrandedFood = async (
    brandedFoodId: string
  ): Promise<{ id: string; name: string }[]> => {
    setLoading(true);
    try {
      // Also add a timeout for expansion (10 seconds)
      const expandPromise = brandedFoodService.getIngredients(brandedFoodId);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Expand timeout")), 10000);
      });

      const res = await Promise.race([expandPromise, timeoutPromise]) as any;
      
      if (res?.status === 200 && res?.data?.mappedIngredients) {
        return res.data.mappedIngredients.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error expanding branded food:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { expandBrandedFood, loading };
}