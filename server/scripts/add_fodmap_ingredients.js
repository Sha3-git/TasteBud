
require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;;


const FODMAP_INGREDIENTS = [
  { name: "Erythritol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Sorbitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Mannitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Xylitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Maltitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Isomalt", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Lactitol", foodGroup: "FODMAP - Polyol", intoleranceType: ["FODMAP"], allergens: [] },
  
  { name: "Inulin", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Chicory root fiber", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Chicory root extract", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Fructooligosaccharides", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "FOS", foodGroup: "FODMAP - Fructan", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Galactooligosaccharides", foodGroup: "FODMAP - GOS", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "GOS", foodGroup: "FODMAP - GOS", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Isomalto-oligosaccharides", foodGroup: "FODMAP - Prebiotic", intoleranceType: ["FODMAP"], allergens: [] },
  
  { name: "Sucralose", foodGroup: "Artificial sweetener", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Aspartame", foodGroup: "Artificial sweetener", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Acesulfame potassium", foodGroup: "Artificial sweetener", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Saccharin", foodGroup: "Artificial sweetener", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Stevia", foodGroup: "Natural sweetener", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Monk fruit extract", foodGroup: "Natural sweetener", intoleranceType: ["Unspecified"], allergens: [] },
  
  { name: "Xanthan gum", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Guar gum", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Carrageenan", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Locust bean gum", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Cellulose gum", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Gellan gum", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Agar", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Pectin", foodGroup: "Additive - Gum", intoleranceType: ["Unspecified"], allergens: [] },
  
  { name: "Soluble corn fiber", foodGroup: "Fiber additive", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Resistant starch", foodGroup: "Fiber additive", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Polydextrose", foodGroup: "Fiber additive", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Resistant maltodextrin", foodGroup: "Fiber additive", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Psyllium", foodGroup: "Fiber additive", intoleranceType: ["Unspecified"], allergens: [] },
  
  { name: "MSG", foodGroup: "Flavor enhancer", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Monosodium glutamate", foodGroup: "Flavor enhancer", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Sulfites", foodGroup: "Preservative", intoleranceType: ["Sulfate"], allergens: [] },
  { name: "Sodium sulfite", foodGroup: "Preservative", intoleranceType: ["Sulfate"], allergens: [] },
  { name: "Sodium metabisulfite", foodGroup: "Preservative", intoleranceType: ["Sulfate"], allergens: [] },
  { name: "Sodium nitrite", foodGroup: "Preservative", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Sodium nitrate", foodGroup: "Preservative", intoleranceType: ["Unspecified"], allergens: [] },
  
  { name: "Citric acid", foodGroup: "Acid additive", intoleranceType: ["Histamine"], allergens: [] },
  { name: "Malic acid", foodGroup: "Acid additive", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Tartaric acid", foodGroup: "Acid additive", intoleranceType: ["Unspecified"], allergens: [] },
  { name: "Lactic acid", foodGroup: "Acid additive", intoleranceType: ["Histamine"], allergens: [] },
  
  { name: "High fructose corn syrup", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Agave syrup", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Agave nectar", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP"], allergens: [] },
  { name: "Crystalline fructose", foodGroup: "FODMAP - Fructose", intoleranceType: ["FODMAP"], allergens: [] },
];


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
    
    const beforeCount = await ingredientsCol.countDocuments();
    console.log(`📊 Current ingredients: ${beforeCount}`);
    
    const existingNames = new Set();
    const existing = await ingredientsCol.find({}, { projection: { name: 1 } }).toArray();
    existing.forEach(doc => existingNames.add(doc.name.toLowerCase()));
    
    const toAdd = FODMAP_INGREDIENTS.filter(ing => 
      !existingNames.has(ing.name.toLowerCase())
    );
    
    console.log(`🆕 New ingredients to add: ${toAdd.length}`);
    console.log(`⏭️  Already exist (skipping): ${FODMAP_INGREDIENTS.length - toAdd.length}\n`);
    
    if (toAdd.length === 0) {
      console.log("✅ All FODMAP ingredients already in database!");
      return;
    }
    
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
    
    const result = await ingredientsCol.insertMany(toAdd);
    console.log(`\n✅ Added ${result.insertedCount} new ingredients!`);
    
    const afterCount = await ingredientsCol.countDocuments();
    console.log(`📊 Total ingredients now: ${afterCount}`);
    
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
