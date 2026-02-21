import { useState, useEffect, useCallback } from "react";
import { ingredientsService } from "../services/ingredientsService";
import { brandedFoodService } from "../services/brandedFoodService";

export interface IngredientResult {
  _id: string;
  name: string;
  foodGroup?: string;
  type: "ingredient";
}

export interface BrandedFoodResult {
  _id: string;
  name: string;
  brandOwner?: string;
  brandedFoodCategory?: string;
  ingredients?: string[];
  type: "branded";
}

export interface CombinedSearchResults {
  ingredients: IngredientResult[];
  brandedFoods: BrandedFoodResult[];
  ingredientsTotal: number;
  brandedTotal: number;
  loading: boolean;
  loadingMore: boolean;
  loadMoreIngredients: () => void;
  loadMoreBranded: () => void;
  hasMoreIngredients: boolean;
  hasMoreBranded: boolean;
}

const PAGE_SIZE = 10;

/**
 * Search hook with "Load More" support
 * Backend returns: { ingredients, branded, ingredientsTotal, brandedTotal }
 */
export function useSearchFoods(query: string): CombinedSearchResults {
  const [ingredients, setIngredients] = useState<IngredientResult[]>([]);
  const [brandedFoods, setBrandedFoods] = useState<BrandedFoodResult[]>([]);
  const [ingredientsTotal, setIngredientsTotal] = useState(0);
  const [brandedTotal, setBrandedTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset and search when query changes
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim() || query.length < 2) {
        setIngredients([]);
        setBrandedFoods([]);
        setIngredientsTotal(0);
        setBrandedTotal(0);
        return;
      }

      setLoading(true);

      try {
        const res = await ingredientsService.search(query, PAGE_SIZE);
        
        if (res.status === 200 && res.data) {
          // Handle new format with totals
          if (res.data.ingredients !== undefined && res.data.branded !== undefined) {
            setIngredients(
              res.data.ingredients.map((item: any) => ({
                _id: item._id,
                name: item.name,
                foodGroup: item.foodGroup,
                type: "ingredient" as const,
              }))
            );
            
            setBrandedFoods(
              res.data.branded.map((item: any) => ({
                _id: item._id,
                name: item.name,
                brandOwner: item.brandOwner,
                brandedFoodCategory: item.brandedFoodCategory,
                ingredients: item.ingredients,
                type: "branded" as const,
              }))
            );
            
            setIngredientsTotal(res.data.ingredientsTotal || res.data.ingredients.length);
            setBrandedTotal(res.data.brandedTotal || res.data.branded.length);
          } 
          // Fallback for old format
          else if (Array.isArray(res.data)) {
            const ingredientItems = res.data.filter((item: any) => item.type === 'ingredient');
            const brandedItems = res.data.filter((item: any) => item.type === 'branded');
            
            setIngredients(ingredientItems.map((item: any) => ({
              _id: item._id,
              name: item.name,
              foodGroup: item.foodGroup,
              type: "ingredient" as const,
            })));
            
            setBrandedFoods(brandedItems.map((item: any) => ({
              _id: item._id,
              name: item.name,
              brandOwner: item.brandOwner,
              brandedFoodCategory: item.brandedFoodCategory,
              ingredients: item.ingredients,
              type: "branded" as const,
            })));
            
            setIngredientsTotal(ingredientItems.length);
            setBrandedTotal(brandedItems.length);
          }
        } else {
          setIngredients([]);
          setBrandedFoods([]);
          setIngredientsTotal(0);
          setBrandedTotal(0);
        }
      } catch (error) {
        console.log("Search error:", error);
        setIngredients([]);
        setBrandedFoods([]);
        setIngredientsTotal(0);
        setBrandedTotal(0);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Load more ingredients
  const loadMoreIngredients = useCallback(async () => {
    if (loadingMore || ingredients.length >= ingredientsTotal) return;
    
    setLoadingMore(true);
    try {
      const res = await ingredientsService.searchWithSkip(
        query, 
        PAGE_SIZE,
        ingredients.length,  // ingredientSkip
        brandedFoods.length  // brandedSkip (keep same)
      );
      
      if (res.status === 200 && res.data?.ingredients) {
        const newIngredients = res.data.ingredients.map((item: any) => ({
          _id: item._id,
          name: item.name,
          foodGroup: item.foodGroup,
          type: "ingredient" as const,
        }));
        
        setIngredients(prev => [...prev, ...newIngredients]);
      }
    } catch (error) {
      console.log("Load more ingredients error:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [query, ingredients.length, brandedFoods.length, ingredientsTotal, loadingMore]);

  // Load more branded foods
  const loadMoreBranded = useCallback(async () => {
    if (loadingMore || brandedFoods.length >= brandedTotal) return;
    
    setLoadingMore(true);
    try {
      const res = await ingredientsService.searchWithSkip(
        query,
        PAGE_SIZE,
        ingredients.length,    // ingredientSkip (keep same)
        brandedFoods.length    // brandedSkip
      );
      
      if (res.status === 200 && res.data?.branded) {
        const newBranded = res.data.branded.map((item: any) => ({
          _id: item._id,
          name: item.name,
          brandOwner: item.brandOwner,
          brandedFoodCategory: item.brandedFoodCategory,
          ingredients: item.ingredients,
          type: "branded" as const,
        }));
        
        setBrandedFoods(prev => [...prev, ...newBranded]);
      }
    } catch (error) {
      console.log("Load more branded error:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [query, ingredients.length, brandedFoods.length, brandedTotal, loadingMore]);

  return { 
    ingredients, 
    brandedFoods, 
    ingredientsTotal,
    brandedTotal,
    loading,
    loadingMore,
    loadMoreIngredients,
    loadMoreBranded,
    hasMoreIngredients: ingredients.length < ingredientsTotal,
    hasMoreBranded: brandedFoods.length < brandedTotal,
  };
}

/**
 * Helper hook to expand branded food to its mapped ingredients
 */
export function useExpandBrandedFood() {
  const [loading, setLoading] = useState(false);

  const expandBrandedFood = async (
    brandedFoodId: string
  ): Promise<{ id: string; name: string }[]> => {
    setLoading(true);
    try {
      const res = await brandedFoodService.getIngredients(brandedFoodId);
      
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