/**
 * IMPORT CROSS-REACTIONS FROM SCIENTIFIC DATA
 * 
 * Reads server/data/cross_reac.json and populates the crossreactions collection
 * with actual protein similarity scores.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importCrossReactions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const ingredientsCollection = db.collection('ingredients');
    const crossReactionsCollection = db.collection('crossreactions');
    
    // Read the JSON file
    const dataPath = path.join(__dirname, 'data', 'cross_reac.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Flatten if nested arrays
    let items = data;
    if (Array.isArray(data[0]) && !data[0].name) {
      items = data.flat();
    }
    
    console.log(`Found ${items.length} foods with cross-reactivity data`);
    
    // Clear existing cross-reactions
    await crossReactionsCollection.deleteMany({});
    console.log('Cleared existing cross-reactions');
    
    let created = 0;
    let notFound = 0;
    
    for (const item of items) {
      if (!item.name || !item.similarity_scores) continue;
      
      // Find the ingredient in our database
      const ingredient = await ingredientsCollection.findOne({
        name: { $regex: new RegExp(`^${escapeRegex(item.name)}$`, 'i') }
      });
      
      if (!ingredient) {
        // Try partial match
        const partialMatch = await ingredientsCollection.findOne({
          name: { $regex: new RegExp(escapeRegex(item.name), 'i') }
        });
        
        if (!partialMatch) {
          notFound++;
          continue;
        }
        
        // Use partial match
        await createCrossReaction(crossReactionsCollection, partialMatch, item);
        created++;
      } else {
        await createCrossReaction(crossReactionsCollection, ingredient, item);
        created++;
      }
    }
    
    console.log(`\n✅ Created ${created} cross-reaction records`);
    console.log(`⚠️  ${notFound} foods not found in ingredients collection`);
    
    // Verify
    const count = await crossReactionsCollection.countDocuments();
    console.log(`Total cross-reactions in DB: ${count}`);
    
    // Show sample
    const sample = await crossReactionsCollection.findOne();
    if (sample) {
      console.log('\nSample record:');
      console.log(`  Ingredient: ${sample.ingredientName}`);
      console.log(`  Similarities: ${sample.similarities.length}`);
      console.log(`  Top 3:`, sample.similarities.slice(0, 3).map(s => `${s.name}: ${s.score}%`).join(', '));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

async function createCrossReaction(collection, ingredient, item) {
  // Transform similarity_scores object to array, filter >= 50%
  const similarities = Object.entries(item.similarity_scores)
    .filter(([name, score]) => score >= 50 && name.toLowerCase() !== ingredient.name.toLowerCase())
    .map(([name, score]) => ({
      name: name,
      score: Math.round(score * 10) / 10  // Round to 1 decimal
    }))
    .sort((a, b) => b.score - a.score);
  
  if (similarities.length === 0) return;
  
  await collection.insertOne({
    ingredient: ingredient._id,
    ingredientName: ingredient.name,
    scientificName: item.scientific_name || null,
    proteinSequence: item.protein_sequence || null,
    similarities: similarities,
    createdAt: new Date()
  });
  
  console.log(`  ✅ ${ingredient.name}: ${similarities.length} cross-reactions`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

importCrossReactions();
