/**
 * TasteBud - Add FODMAP & Additive Ingredients
 * =============================================
 * Run this script to add FODMAP triggers and common additives
 * to your ingredients database so they can be tracked.
 * 
 * Run: node add_fodmap_ingredients.js
 */

const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://DataBaseUsr:Ftw0Ji2BRw1kRQlA@cluster0.f1lvvua.mongodb.net/TasteBud";

// ============================================================
// FODMAP INGREDIENTS TO ADD
// ============================================================

const FODMAP_INGREDIENTS = [
  // ----------------------
  // POLYOLS (Sugar Alcohols) - The "P" in FODMAP
  // ----------------------
  { name: "Erythritol", foodGroup: "FODMAP - Polyol", fodmapCategory: "Polyol", fodmapLevel: "moderate" },
  { name: "Sorbitol", foodGroup: "FODMAP - Polyol", fodmapCategory: "Polyol", fodmapLevel: "high" },
  { name: "Mannitol", foodGroup: "FODMAP - Polyol", fodmapCategory: "Polyol", fodmapLevel: "high" },
  { name: "Xylitol", foodGroup: "FODMAP - Polyol", fodmapCategory: "Polyol", fodmapLevel: "high" },
  { name: "Maltitol", foodGroup: "FODMAP - Polyol", fodmapCategory: "Polyol", fodmapLevel: "high" },
  { name: "Isomalt", foodGroup: "FODMAP - Polyol", fodmapCategory: "Polyol", fodmapLevel: "high" },
  { name: "Lactitol", foodGroup: "FODMAP - Polyol", fodmapCategory: "Polyol", fodmapLevel: "high" },
  
  // ----------------------
  // OLIGOSACCHARIDES - The "O" in FODMAP (Fructans & GOS)
  // ----------------------
  { name: "Inulin", foodGroup: "FODMAP - Fructan", fodmapCategory: "Oligosaccharide", fodmapLevel: "high" },
  { name: "Chicory root fiber", foodGroup: "FODMAP - Fructan", fodmapCategory: "Oligosaccharide", fodmapLevel: "high" },
  { name: "Chicory root extract", foodGroup: "FODMAP - Fructan", fodmapCategory: "Oligosaccharide", fodmapLevel: "high" },
  { name: "Fructooligosaccharides", foodGroup: "FODMAP - Fructan", fodmapCategory: "Oligosaccharide", fodmapLevel: "high" },
  { name: "FOS", foodGroup: "FODMAP - Fructan", fodmapCategory: "Oligosaccharide", fodmapLevel: "high" },
  { name: "Galactooligosaccharides", foodGroup: "FODMAP - GOS", fodmapCategory: "Oligosaccharide", fodmapLevel: "high" },
  { name: "GOS", foodGroup: "FODMAP - GOS", fodmapCategory: "Oligosaccharide", fodmapLevel: "high" },
  { name: "Isomalto-oligosaccharides", foodGroup: "FODMAP - Prebiotic", fodmapCategory: "Oligosaccharide", fodmapLevel: "moderate" },
  
  // ----------------------
  // ARTIFICIAL SWEETENERS (Non-FODMAP but cause issues)
  // ----------------------
  { name: "Sucralose", foodGroup: "Artificial sweetener", fodmapCategory: "Sweetener", fodmapLevel: "low" },
  { name: "Aspartame", foodGroup: "Artificial sweetener", fodmapCategory: "Sweetener", fodmapLevel: "low" },
  { name: "Acesulfame potassium", foodGroup: "Artificial sweetener", fodmapCategory: "Sweetener", fodmapLevel: "low" },
  { name: "Saccharin", foodGroup: "Artificial sweetener", fodmapCategory: "Sweetener", fodmapLevel: "low" },
  { name: "Stevia", foodGroup: "Natural sweetener", fodmapCategory: "Sweetener", fodmapLevel: "low" },
  { name: "Monk fruit extract", foodGroup: "Natural sweetener", fodmapCategory: "Sweetener", fodmapLevel: "low" },
  
  // ----------------------
  // GUMS & THICKENERS (Common IBS triggers)
  // ----------------------
  { name: "Xanthan gum", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "moderate" },
  { name: "Guar gum", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "moderate" },
  { name: "Carrageenan", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "moderate" },
  { name: "Locust bean gum", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "moderate" },
  { name: "Cellulose gum", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "low" },
  { name: "Gellan gum", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "low" },
  { name: "Agar", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "low" },
  { name: "Pectin", foodGroup: "Additive - Gum", fodmapCategory: "Thickener", fodmapLevel: "low" },
  
  // ----------------------
  // FIBERS (Can cause issues in sensitive individuals)
  // ----------------------
  { name: "Soluble corn fiber", foodGroup: "Fiber additive", fodmapCategory: "Fiber", fodmapLevel: "moderate" },
  { name: "Resistant starch", foodGroup: "Fiber additive", fodmapCategory: "Fiber", fodmapLevel: "moderate" },
  { name: "Polydextrose", foodGroup: "Fiber additive", fodmapCategory: "Fiber", fodmapLevel: "moderate" },
  { name: "Resistant maltodextrin", foodGroup: "Fiber additive", fodmapCategory: "Fiber", fodmapLevel: "moderate" },
  { name: "Psyllium", foodGroup: "Fiber additive", fodmapCategory: "Fiber", fodmapLevel: "low" },
  
  // ----------------------
  // COMMON DIGESTIVE IRRITANTS
  // ----------------------
  { name: "MSG", foodGroup: "Flavor enhancer", fodmapCategory: "Additive", fodmapLevel: "varies" },
  { name: "Monosodium glutamate", foodGroup: "Flavor enhancer", fodmapCategory: "Additive", fodmapLevel: "varies" },
  { name: "Sulfites", foodGroup: "Preservative", fodmapCategory: "Additive", fodmapLevel: "varies" },
  { name: "Sodium sulfite", foodGroup: "Preservative", fodmapCategory: "Additive", fodmapLevel: "varies" },
  { name: "Sodium metabisulfite", foodGroup: "Preservative", fodmapCategory: "Additive", fodmapLevel: "varies" },
  { name: "Sodium nitrite", foodGroup: "Preservative", fodmapCategory: "Additive", fodmapLevel: "varies" },
  { name: "Sodium nitrate", foodGroup: "Preservative", fodmapCategory: "Additive", fodmapLevel: "varies" },
  
  // ----------------------
  // HISTAMINE TRIGGERS (Often confused with allergies)
  // ----------------------
  { name: "Citric acid", foodGroup: "Acid additive", fodmapCategory: "Acid", fodmapLevel: "low" },
  { name: "Malic acid", foodGroup: "Acid additive", fodmapCategory: "Acid", fodmapLevel: "low" },
  { name: "Tartaric acid", foodGroup: "Acid additive", fodmapCategory: "Acid", fodmapLevel: "low" },
  { name: "Lactic acid", foodGroup: "Acid additive", fodmapCategory: "Acid", fodmapLevel: "low" },
  
  // ----------------------
  // COMMON HIGH-FODMAP FOODS (if not already in DB)
  // ----------------------
  { name: "High fructose corn syrup", foodGroup: "FODMAP - Fructose", fodmapCategory: "Monosaccharide", fodmapLevel: "high" },
  { name: "Agave syrup", foodGroup: "FODMAP - Fructose", fodmapCategory: "Monosaccharide", fodmapLevel: "high" },
  { name: "Agave nectar", foodGroup: "FODMAP - Fructose", fodmapCategory: "Monosaccharide", fodmapLevel: "high" },
  { name: "Crystalline fructose", foodGroup: "FODMAP - Fructose", fodmapCategory: "Monosaccharide", fodmapLevel: "high" },
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
