/**
 * CLEANUP UNSAFE FOODS
 * 
 * Removes:
 * - Duplicate entries
 * - Unknown/unresolved ingredients
 * - Excluded ingredients (water, salt, sugar, flour, etc.)
 */

const mongoose = require('mongoose');
require('dotenv').config();

const EXCLUDED_INGREDIENTS = new Set([
  'water', 'tap water', 'spring water', 'mineral water', 'ice', 'ice water',
  'salt', 'sea salt', 'table salt', 'kosher salt', 'sodium chloride',
  'pepper', 'black pepper', 'white pepper',
  'sugar', 'white sugar', 'brown sugar', 'cane sugar', 'granulated sugar',
  'powdered sugar', 'confectioners sugar', 'icing sugar',
  'oil', 'vegetable oil', 'cooking oil', 'canola oil', 'sunflower oil',
  'palm oil', 'oil palm', 'soybean oil', 'corn oil', 'rapeseed oil',
  'flour', 'wheat flour', 'all-purpose flour', 'white flour', 'bread flour',
  'starch', 'corn starch', 'cornstarch', 'modified starch', 'modified food starch',
  'rice', 'white rice', 'rice flour',
  'yeast', 'baking powder', 'baking soda', 'sodium bicarbonate',
  'vinegar', 'white vinegar', 'distilled vinegar',
  'other', 'other ingredients', 'natural flavors', 'natural flavor',
  'artificial flavors', 'artificial flavor', 'flavoring', 'spices', 'seasoning',
  'tobacco', 'unknown', 'unknown ingredient',
]);

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const unsafeFoodsCollection = db.collection('unsafefoods');
    const mappingsCollection = db.collection('ingredient_mappings');
    
    // Get all unsafe food documents
    const docs = await unsafeFoodsCollection.find({}).toArray();
    console.log(`Found ${docs.length} users with unsafe foods`);
    
    let totalRemoved = 0;
    let totalDeduped = 0;
    
    for (const doc of docs) {
      if (!doc.ingredients || doc.ingredients.length === 0) continue;
      
      console.log(`\nProcessing user: ${doc.userId}`);
      console.log(`  Original ingredients: ${doc.ingredients.length}`);
      
      const seenIds = new Set();
      const cleanedIngredients = [];
      
      for (const item of doc.ingredients) {
        const ingredientId = item.ingredient.toString();
        
        // Skip duplicates
        if (seenIds.has(ingredientId)) {
          totalDeduped++;
          console.log(`  🔄 Duplicate removed`);
          continue;
        }
        seenIds.add(ingredientId);
        
        // Resolve ingredient name
        let ingredientName = null;
        try {
          const objectId = new mongoose.Types.ObjectId(ingredientId);
          const mapping = await mappingsCollection.findOne({ matchedId: objectId });
          if (mapping) {
            ingredientName = mapping.matchedName;
          } else {
            const ingredient = await db.collection('ingredients').findOne({ _id: objectId });
            if (ingredient) {
              ingredientName = ingredient.name;
            }
          }
        } catch (err) {
          // Invalid ID
        }
        
        // Skip unresolved
        if (!ingredientName) {
          totalRemoved++;
          console.log(`  ❌ Removed: Unknown (ID: ${ingredientId})`);
          continue;
        }
        
        // Skip excluded
        if (EXCLUDED_INGREDIENTS.has(ingredientName.toLowerCase().trim())) {
          totalRemoved++;
          console.log(`  ❌ Removed: ${ingredientName} (excluded)`);
          continue;
        }
        
        cleanedIngredients.push(item);
      }
      
      console.log(`  Cleaned ingredients: ${cleanedIngredients.length}`);
      
      // Update document
      await unsafeFoodsCollection.updateOne(
        { _id: doc._id },
        { $set: { ingredients: cleanedIngredients } }
      );
    }
    
    console.log(`\n✅ Cleanup complete!`);
    console.log(`  Duplicates removed: ${totalDeduped}`);
    console.log(`  Bad entries removed: ${totalRemoved}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

cleanup();
