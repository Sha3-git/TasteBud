import { useState, useEffect, useCallback } from "react";
import { unsafeFoodsService } from "../services/unsafeFoodsService";
import { crossReactionsService, CrossReaction } from "../services/crossReactionsService";

interface RelatedFood {
  name: string;
  percentage: number;
  riskLevel: 'high' | 'medium' | 'low';
}

interface CrossReactivityData {
  allergen: string;
  category: string;
  emoji: string;
  color: string;
  relatedFoods: RelatedFood[];
  scientificReason: string;
  advice: string;
  isExpanded: boolean;
}

interface CrossReactivityResult {
  userAllergies: string[];
  riskOverview: { high: number; medium: number; low: number };
  crossReactivities: CrossReactivityData[];
}

// Helper to get emoji based on food group
function getEmojiForFoodGroup(foodGroup: string): string {
  const emojiMap: Record<string, string> = {
    'Dairy': '🥛',
    'Eggs': '🥚',
    'Seafood': '🐟',
    'Fish': '🐟',
    'Shellfish': '🦐',
    'Legumes': '🥜',
    'Grains': '🌾',
    'Cereals': '🌾',
    'Fruits': '🍎',
    'Vegetables': '🥬',
    'Meat': '🥩',
    'Poultry': '🍗',
    'Nuts': '🥜',
    'Tree nuts': '🌰',
    'Spices': '🌶️',
    'Herbs': '🌿',
  };
  return emojiMap[foodGroup] || '🍽️';
}

// Helper to get color based on food group
function getColorForFoodGroup(foodGroup: string): string {
  const colorMap: Record<string, string> = {
    'Dairy': '#F5F5DC',
    'Eggs': '#FFD700',
    'Seafood': '#5DADE2',
    'Fish': '#5DADE2',
    'Shellfish': '#E74C3C',
    'Legumes': '#A0826D',
    'Grains': '#D4AC0D',
    'Cereals': '#D4AC0D',
    'Fruits': '#E74C3C',
    'Vegetables': '#27AE60',
    'Meat': '#C0392B',
    'Poultry': '#F39C12',
    'Nuts': '#8B4513',
  };
  return colorMap[foodGroup] || '#6B7280';
}

// Helper to determine risk level from score
function getRiskLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

// Helper to generate readable scientific explanation
function generateScientificReason(allergenName: string, topFoods: RelatedFood[]): string {
  const highRiskCount = topFoods.filter(f => f.riskLevel === 'high').length;
  const avgScore = Math.round(topFoods.reduce((sum, f) => sum + f.percentage, 0) / topFoods.length);
  
  return `${allergenName} contains proteins that share structural similarities with ${topFoods.length} other foods. ` +
    `The average protein sequence match is ${avgScore}%, with ${highRiskCount} foods showing high similarity (70%+). ` +
    `These shared proteins can trigger similar immune responses in sensitive individuals.`;
}

export function useCrossReactivity() {
  const userId = "69173dd5a3866b85b59d9760"; // TODO: Replace with auth context
  
  const [data, setData] = useState<CrossReactivityResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Step 1: Get user's unsafe foods
      const unsafeFoodsResponse = await unsafeFoodsService.getUnsafeFoods(userId);
      const unsafeFoods = unsafeFoodsResponse.data;
      
      if (!unsafeFoods?.ingredients || unsafeFoods.ingredients.length === 0) {
        setData({
          userAllergies: [],
          riskOverview: { high: 0, medium: 0, low: 0 },
          crossReactivities: []
        });
        return;
      }
      
      // IMPORTANT: Only get ACTUAL allergies (preExisting or confirmed)
      // NOT suspected triggers from the algorithm
      const confirmedAllergies = unsafeFoods.ingredients.filter(
        item => item.preExisting === true || item.status === "confirmed" || item.status === "suspected"
      );
      
      // Remove duplicates
      const uniqueAllergies = confirmedAllergies.filter(
        (item, index, self) => 
          index === self.findIndex(t => t.ingredient._id === item.ingredient._id)
      );
      
      if (uniqueAllergies.length === 0) {
        setData({
          userAllergies: [],
          riskOverview: { high: 0, medium: 0, low: 0 },
          crossReactivities: []
        });
        return;
      }
      
      const userAllergies = uniqueAllergies.map(item => item.ingredient.name);
      
      // Step 2: Fetch cross-reactions for each CONFIRMED allergy only
      const crossReactivities: CrossReactivityData[] = [];
      let highCount = 0;
      let mediumCount = 0;
      let lowCount = 0;
      
      for (const item of uniqueAllergies) {
        try {
          const crossReactionResponse = await crossReactionsService.getCrossReactions(
            item.ingredient._id
          );
          const crossReactions = crossReactionResponse.data;
          
          if (crossReactions && crossReactions.length > 0) {
            const reaction = crossReactions[0]; // Get the first match
            
            // Transform similarities to relatedFoods
            // Filter to show top 10 with score >= 50%
            const relatedFoods: RelatedFood[] = reaction.similarities
              .filter(sim => sim.score >= 50)
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map(sim => {
                const riskLevel = getRiskLevel(sim.score);
                if (riskLevel === 'high') highCount++;
                else if (riskLevel === 'medium') mediumCount++;
                else lowCount++;
                
                return {
                  name: sim.name,
                  percentage: Math.round(sim.score),
                  riskLevel
                };
              });
            
            if (relatedFoods.length > 0) {
              crossReactivities.push({
                allergen: item.ingredient.name,
                category: item.ingredient.foodGroup || 'Other',
                emoji: getEmojiForFoodGroup(item.ingredient.foodGroup),
                color: getColorForFoodGroup(item.ingredient.foodGroup),
                relatedFoods,
                scientificReason: generateScientificReason(item.ingredient.name, relatedFoods),
                advice: `Be cautious with these foods if you have a ${item.ingredient.name} allergy. Consider allergy testing before trying new foods from this list.`,
                isExpanded: false
              });
            }
          }
        } catch (err) {
          console.log(`No cross-reactions found for ${item.ingredient.name}`);
        }
      }
      
      setData({
        userAllergies,
        riskOverview: { high: highCount, medium: mediumCount, low: lowCount },
        crossReactivities
      });
      
    } catch (err: any) {
      console.error("Failed to fetch cross-reactivity data:", err);
      setError(err.message || "Failed to fetch cross-reactivity data");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleExpand = (index: number) => {
    if (!data) return;
    const updated = [...data.crossReactivities];
    updated[index].isExpanded = !updated[index].isExpanded;
    setData({ ...data, crossReactivities: updated });
  };

  return { data, isLoading, error, refetch: fetchData, toggleExpand };
}
