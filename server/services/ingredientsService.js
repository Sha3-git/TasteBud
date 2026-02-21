/**
 * UPGRADED INGREDIENT SEARCH SERVICE
 * 
 * Features:
 * 1. Searches BOTH ingredients and brandedfoods collections
 * 2. Returns total counts for "Show X more" UX
 * 3. Supports pagination with skip parameter
 * 4. Excludes embeddings from response (saves ~90% bandwidth)
 * 5. Better ranking - exact matches first
 */

const Ingredient = require("../models/ingredients");
const BrandedFood = require("../models/brandedFoods");

/**
 * Search both ingredients and branded foods
 * Returns unified results with total counts for pagination
 * 
 * @param {string} query - Search term
 * @param {number} limit - Max results per category (default 10)
 * @param {number} ingredientSkip - Skip N ingredients (for "load more")
 * @param {number} brandedSkip - Skip N branded foods (for "load more")
 */
const searchIngredients = async (query, limit = 10, ingredientSkip = 0, brandedSkip = 0) => {
  try {
    if (!query || query.trim() === "") {
      return { ingredients: [], branded: [], ingredientsTotal: 0, brandedTotal: 0 };
    }

    const q = query.trim();
    const qLower = q.toLowerCase();

    // =======================================================================
    // SEARCH 1: Base ingredients using regex (collection is small ~2800 docs)
    // =======================================================================
    
    const regex = new RegExp(q, "i");  // case-insensitive substring match
    
    // Get total count first
    const ingredientsTotal = await Ingredient.countDocuments({
      $or: [
        { name: regex },
        { scientificName: regex }
      ]
    });
    
    // Get paginated results
    let ingredientResults = await Ingredient.find({
      $or: [
        { name: regex },
        { scientificName: regex }
      ]
    })
      .select('-embedding')
      .lean();
    
    // Sort by exact match first, then starts-with, then contains
    ingredientResults.sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      const aExact = aLower === qLower;
      const bExact = bLower === qLower;
      const aStarts = aLower.startsWith(qLower);
      const bStarts = bLower.startsWith(qLower);
      
      if (aExact && !bExact) return -1;
      if (bExact && !aExact) return 1;
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;
      return aLower.localeCompare(bLower);
    });

    // Apply skip and limit after sorting
    ingredientResults = ingredientResults.slice(ingredientSkip, ingredientSkip + limit);

    // Add type indicator
    ingredientResults = ingredientResults.map(ing => ({
      ...ing,
      type: 'ingredient'
    }));

    // =======================================================================
    // SEARCH 2: Branded foods using ATLAS SEARCH
    // =======================================================================
    
    // Get total count for branded (using $searchMeta or separate count)
    let brandedTotal = 0;
    try {
      const countResult = await BrandedFood.aggregate([
        {
          $search: {
            index: "brandedfoods_search",
            text: {
              query: q,
              path: ["brandOwner", "brandedFoodCategory"],
              fuzzy: { maxEdits: 1 }
            }
          }
        },
        { $count: "total" }
      ]);
      brandedTotal = countResult[0]?.total || 0;
    } catch (e) {
      // If count fails, estimate from results
      brandedTotal = 0;
    }

    // Get paginated branded results
    let brandedResults = await BrandedFood.aggregate([
      {
        $search: {
          index: "brandedfoods_search",
          text: {
            query: q,
            path: ["brandOwner", "brandedFoodCategory"],
            fuzzy: { maxEdits: 1 }
          }
        }
      },
      { $skip: brandedSkip },
      { $limit: limit },
      {
        $project: {
          brandOwner: 1,
          brandedFoodCategory: 1,
          ingredients: 1,
          ingredientsMapping: 1,
          score: { $meta: "searchScore" }
        }
      }
    ]);

    // Transform branded foods to unified format
    brandedResults = brandedResults.map(bf => {
      const displayName = bf.brandedFoodCategory 
        ? `${bf.brandOwner} - ${bf.brandedFoodCategory}`
        : bf.brandOwner;
      
      return {
        _id: bf._id,
        name: displayName,
        brandOwner: bf.brandOwner,
        brandedFoodCategory: bf.brandedFoodCategory,
        ingredients: bf.ingredients,
        ingredientsMapping: bf.ingredientsMapping,
        type: 'branded',
        foodGroup: bf.brandedFoodCategory
      };
    });

    // =======================================================================
    // RETURN WITH TOTALS
    // =======================================================================
    
    return {
      ingredients: ingredientResults,
      branded: brandedResults,
      ingredientsTotal,
      brandedTotal
    };

  } catch (err) {
    console.error("Search error:", err);
    return { ingredients: [], branded: [], ingredientsTotal: 0, brandedTotal: 0 };
  }
};

/**
 * Search ONLY base ingredients using regex
 */
const searchBaseIngredients = async (query, limit = 20, skip = 0) => {
  try {
    if (!query || query.trim() === "") return { results: [], total: 0 };

    const q = query.trim();
    const qLower = q.toLowerCase();
    const regex = new RegExp(q, "i");

    const total = await Ingredient.countDocuments({
      $or: [{ name: regex }, { scientificName: regex }]
    });

    let results = await Ingredient.find({
      $or: [{ name: regex }, { scientificName: regex }]
    })
      .select('-embedding')
      .lean();

    // Sort by exact match first, then starts-with, then contains
    results.sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      const aExact = aLower === qLower;
      const bExact = bLower === qLower;
      const aStarts = aLower.startsWith(qLower);
      const bStarts = bLower.startsWith(qLower);
      
      if (aExact && !bExact) return -1;
      if (bExact && !aExact) return 1;
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;
      return aLower.localeCompare(bLower);
    });

    // Apply pagination after sorting
    results = results.slice(skip, skip + limit);

    return { results, total };
  } catch (err) {
    console.error("Base ingredient search error:", err);
    return { results: [], total: 0 };
  }
};

/**
 * Search ONLY branded foods using Atlas Search
 */
const searchBrandedFoods = async (query, limit = 20, skip = 0) => {
  try {
    if (!query || query.trim() === "") return { results: [], total: 0 };

    // Get total
    let total = 0;
    try {
      const countResult = await BrandedFood.aggregate([
        {
          $search: {
            index: "brandedfoods_search",
            text: {
              query: query.trim(),
              path: ["brandOwner", "brandedFoodCategory"],
              fuzzy: { maxEdits: 1 }
            }
          }
        },
        { $count: "total" }
      ]);
      total = countResult[0]?.total || 0;
    } catch (e) {
      total = 0;
    }

    const results = await BrandedFood.aggregate([
      {
        $search: {
          index: "brandedfoods_search",
          text: {
            query: query.trim(),
            path: ["brandOwner", "brandedFoodCategory"],
            fuzzy: { maxEdits: 1 }
          }
        }
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "ingredients",
          localField: "ingredientsMapping.ingredient",
          foreignField: "_id",
          as: "mappedIngredients"
        }
      },
      {
        $project: {
          brandOwner: 1,
          brandedFoodCategory: 1,
          ingredients: 1,
          mappedIngredients: {
            _id: 1,
            name: 1,
            foodGroup: 1,
            intoleranceType: 1,
            allergens: 1
          },
          score: { $meta: "searchScore" }
        }
      }
    ]);

    return { results, total };
  } catch (err) {
    console.error("Branded food search error:", err);
    return { results: [], total: 0 };
  }
};

/**
 * Get ingredient by ID (with embedding excluded)
 */
const getIngredientById = async (id) => {
  try {
    return await Ingredient.findById(id).select('-embedding').lean();
  } catch (err) {
    console.error("Get ingredient error:", err);
    return null;
  }
};

module.exports = {
  searchIngredients,
  searchBaseIngredients,
  searchBrandedFoods,
  getIngredientById
};