/**
 * TasteBud - Add FODMAP & Additive Ingredients
 * =============================================
 * Run this script to add FODMAP triggers and common additives
 * to your ingredients database so they can be tracked.
 * 
 * Run: node add_fodmap_ingredients.js
 */

const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;;

// ============================================================
// FODMAP INGREDIENTS TO ADD
// ============================================================

const FODMAP_INGREDIENTS = [
  // ----------------------
  // POLYOLS (Sugar Alcohols) - The "P" in FODMAP
  // ----------------------
  { name: "Erythritol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP", "Polyol"], allergens: [] },
  { name: "Sorbitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP", "Polyol"], allergens: [] },
  { name: "Mannitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP", "Polyol"], allergens: [] },
  { name: "Xylitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP", "Polyol"], allergens: [] },
  { name: "Maltitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP", "Polyol"], allergens: [] },
  { name: "Isomalt", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP", "Polyol"], allergens: [] },
  { name: "Lactitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP", "Polyol"], allergens: [] },
  
  // ----------------------
  // OLIGOSACCHARIDES - The "O" in FODMAP (Fructans & GOS)
  // ----------------------
  { name: "Inulin", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP", "Fructan"], allergens: [] },
  { name: "Chicory root fiber", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP", "Fructan"], allergens: [] },
  { name: "Chicory root extract", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP", "Fructan"], allergens: [] },
  { name: "Fructooligosaccharides", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP", "Fructan"], allergens: [] },
  { name: "FOS", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP", "Fructan"], allergens: [] },
  { name: "Galactooligosaccharides", foodGroup: "FODMAP - GOS", intoleranceType: ["FODMAP", "GOS"], allergens: [] },
  { name: "GOS", foodGroup: "FODMAP - GOS", intoleranceType: ["FODMAP", "GOS"], allergens: [] },
  { name: "Isomalto-oligosaccharides", foodGroup: "FODMAP - Prebiotic", intoleranceType: ["FODMAP", "Prebiotic"], allergens: [] },
  
  // ----------------------
  // ARTIFICIAL SWEETENERS (Non-FODMAP but cause issues)
  // ----------------------
  { name: "Sucralose", foodGroup: "Artificial sweetener", intoleranceType: ["Artificial Sweetener"], allergens: [] },
  { name: "Aspartame", foodGroup: "Artificial sweetener", intoleranceType: ["Artificial Sweetener"], allergens: [] },
  { name: "Acesulfame potassium", foodGroup: "Artificial sweetener", intoleranceType: ["Artificial Sweetener"], allergens: [] },
  { name: "Saccharin", foodGroup: "Artificial sweetener", intoleranceType: ["Artificial Sweetener"], allergens: [] },
  { name: "Stevia", foodGroup: "Natural sweetener", intoleranceType: ["Natural Sweetener"], allergens: [] },
  { name: "Monk fruit extract", foodGroup: "Natural sweetener", intoleranceType: ["Natural Sweetener"], allergens: [] },
  
  // ----------------------
  // GUMS & THICKENERS (Common IBS triggers)
  // ----------------------
  { name: "Xanthan gum", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  { name: "Guar gum", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  { name: "Carrageenan", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  { name: "Locust bean gum", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  { name: "Cellulose gum", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  { name: "Gellan gum", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  { name: "Agar", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  { name: "Pectin", foodGroup: "Additive - Gum", intoleranceType: ["Additive - Gum"], allergens: [] },
  
  // ----------------------
  // FIBERS (Can cause issues in sensitive individuals)
  // ----------------------
  { name: "Soluble corn fiber", foodGroup: "Fiber additive", intoleranceType: ["Fiber additive"], allergens: [] },
  { name: "Resistant starch", foodGroup: "Fiber additive", intoleranceType: ["Fiber additive"], allergens: [] },
  { name: "Polydextrose", foodGroup: "Fiber additive", intoleranceType: ["Fiber additive"], allergens: [] },
  { name: "Resistant maltodextrin", foodGroup: "Fiber additive", intoleranceType: ["Fiber additive"], allergens: [] },
  { name: "Psyllium", foodGroup: "Fiber additive", intoleranceType: ["Fiber additive"], allergens: [] },
  
  // ----------------------
  // COMMON DIGESTIVE IRRITANTS
  // ----------------------
  { name: "MSG", foodGroup: "Flavor enhancer", intoleranceType: ["Flavor enhancer"], allergens: [] },
  { name: "Monosodium glutamate", foodGroup: "Flavor enhancer", intoleranceType: ["Flavor enhancer"], allergens: [] },
  { name: "Sulfites", foodGroup: "Preservative", intoleranceType: ["Preservative"], allergens: [] },
  { name: "Sodium sulfite", foodGroup: "Preservative", intoleranceType: ["Preservative"], allergens: [] },
  { name: "Sodium metabisulfite", foodGroup: "Preservative", intoleranceType: ["Preservative"], allergens: [] },
  { name: "Sodium nitrite", foodGroup: "Preservative", intoleranceType: ["Preservative"], allergens: [] },
  { name: "Sodium nitrate", foodGroup: "Preservative", intoleranceType: ["Preservative"], allergens: [] },
  
  // ----------------------
  // HISTAMINE TRIGGERS (Often confused with allergies)
  // ----------------------
  { name: "Citric acid", foodGroup: "Acid additive", intoleranceType: ["Acid additive"], allergens: [] },
  { name: "Malic acid", foodGroup: "Acid additive", intoleranceType: ["Acid additive"], allergens: [] },
  { name: "Tartaric acid", foodGroup: "Acid additive", intoleranceType: ["Acid additive"], allergens: [] },
  { name: "Lactic acid", foodGroup: "Acid additive", intoleranceType: ["Acid additive"], allergens: [] },
  
  // ----------------------
  // COMMON HIGH-FODMAP FOODS (if not already in DB)
  // ----------------------
  { name: "High fructose corn syrup", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP", "Fructose"], allergens: [] },
  { name: "Agave syrup", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP", "Fructose"], allergens: [] },
  { name: "Agave nectar", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP", "Fructose"], allergens: [] },
  { name: "Crystalline fructose", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP", "Fructose"], allergens: [] },
];

// ============================================================
// MAIN SCRIPT
// ============================================================

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🍽️  TasteBud - Add FODMAP & Additive Ingredients");
  console.log("=".repeat(60) + "\n");
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas\n");
    
    const db = client.db("TasteBud");
    const ingredientsCol = db.collection("ingredients");
    
    // Get current count
    const beforeCount = await ingredientsCol.countDocuments();
    console.log(`📊 Current ingredients: ${beforeCount}`);
    
    // Check which ingredients already exist
    const existingNames = new Set();
    const existing = await ingredientsCol.find({}, { projection: { name: 1 } }).toArray();
    existing.forEach(doc => existingNames.add(doc.name.toLowerCase()));
    
    // Filter to only new ingredients
    const toAdd = FODMAP_INGREDIENTS.filter(ing => 
      !existingNames.has(ing.name.toLowerCase())
    );
    
    console.log(`🆕 New ingredients to add: ${toAdd.length}`);
    console.log(`⏭️  Already exist (skipping): ${FODMAP_INGREDIENTS.length - toAdd.length}\n`);
    
    if (toAdd.length === 0) {
      console.log("✅ All FODMAP ingredients already in database!");
      return;
    }
    
    // Show what we're adding
    console.log("📝 Adding:");
    const byGroup = {};
    toAdd.forEach(ing => {
      if (!byGroup[ing.foodGroup]) byGroup[ing.foodGroup] = [];
      byGroup[ing.foodGroup].push(ing.name);
    });
    
    for (const [group, items] of Object.entries(byGroup)) {
      console.log(`\n   ${group}:`);
      items.forEach(item => console.log(`      - ${item}`));
    }
    
    // Confirm
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question("\n➡️  Add these ingredients? (y/n): ", resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() !== 'y') {
      console.log("❌ Cancelled");
      return;
    }
    
    // Insert
    const result = await ingredientsCol.insertMany(toAdd);
    console.log(`\n✅ Added ${result.insertedCount} new ingredients!`);
    
    // Verify
    const afterCount = await ingredientsCol.countDocuments();
    console.log(`📊 Total ingredients now: ${afterCount}`);
    
    // Show FODMAP-specific ingredients
    const fodmapCount = await ingredientsCol.countDocuments({
      foodGroup: { $regex: /FODMAP|Additive|sweetener|Fiber/i }
    });
    console.log(`🎯 FODMAP/Additive ingredients: ${fodmapCount}`);
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ COMPLETE!");
    console.log("=".repeat(60));
    console.log("\nNext step: Run the updated ML matching script to map these");
    console.log("           in branded foods.\n");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

main();
