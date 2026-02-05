"""
TasteBud ML Ingredient Matcher
==============================
This script uses AI embeddings to match branded food ingredients 
to your ingredient database with high accuracy.

How it works:
1. Creates vector embeddings for all 1,220 ingredients
2. For each branded food ingredient string, creates an embedding
3. Finds the most similar ingredient using cosine similarity
4. Saves mappings to MongoDB for instant lookup

Run: python match_ingredients.py
"""

import os
import re
import json
from datetime import datetime
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import numpy as np

# ============================================================
# CONFIGURATION
# ============================================================

# Your MongoDB Atlas (ingredients database)
MONGO_ATLAS_URI = os.environ.get("MONGO_URI")
ATLAS_DB_NAME = "TasteBud"

# External MongoDB (branded foods database)
MONGO_FOODS_URI = os.environ.get("MONGO_FOODS_URI")
FOODS_DB_NAME = "TasteBud"

# Model to use (good balance of speed and accuracy)
MODEL_NAME = "all-MiniLM-L6-v2"

# Minimum similarity score to accept a match (0.0 - 1.0)
MIN_SIMILARITY = 0.35

# Batch size for processing
BATCH_SIZE = 100

# ============================================================
# CLEANING FUNCTIONS
# ============================================================

# Words to skip entirely
SKIP_PATTERNS = [
    r'^VITAMIN', r'^ADDED', r'^CONTAINS', r'^LESS THAN',
    r'PHOSPHATE', r'CARBONATE', r'BICARBONATE', r'SULFATE', r'NITRATE',
    r'ASCORBATE', r'CITRATE', r'ACETATE', r'BENZOATE', r'SORBATE',
    r'NIACIN', r'THIAMIN', r'RIBOFLAVIN', r'FOLIC', r'FOLATE',
    r'^TO PRESERVE', r'^FOR COLOR', r'^AS A', r'^USED TO'
]

def should_skip(ingredient_str):
    """Check if ingredient should be skipped (vitamins, additives, etc.)"""
    upper = ingredient_str.upper()
    for pattern in SKIP_PATTERNS:
        if re.search(pattern, upper):
            return True
    if len(ingredient_str) < 2 or len(ingredient_str) > 60:
        return True
    return False

def clean_ingredient(raw_ingredient):
    """Clean and normalize ingredient string for better matching"""
    s = raw_ingredient.upper()
    
    # Remove parentheses content
    s = re.sub(r'\([^)]*\)', ' ', s)
    s = re.sub(r'\[[^\]]*\]', ' ', s)
    
    # Remove percentages and numbers
    s = re.sub(r'\d+\.?\d*%?', '', s)
    
    # Remove special characters except spaces
    s = re.sub(r'[^\w\s]', ' ', s)
    
    # Remove common prefixes that don't help matching
    prefixes = [
        'WHOLE GRAIN', 'ORGANIC', 'NATURAL', 'PURE', 'RAW', 'DRIED',
        'FRESH', 'GROUND', 'ROASTED', 'TOASTED', 'ENRICHED', 'BLEACHED',
        'UNBLEACHED', 'MODIFIED', 'HYDROLYZED', 'PARTIALLY', 'FULLY',
        'REDUCED', 'LOW FAT', 'NONFAT', 'FAT FREE', 'SKIMMED', 'SKIM',
        'DEHYDRATED', 'CONCENTRATED', 'DISTILLED'
    ]
    for prefix in prefixes:
        s = re.sub(f'^{prefix}\\s+', '', s)
    
    # Normalize whitespace
    s = ' '.join(s.split())
    
    return s.strip()

# ============================================================
# MAIN SCRIPT
# ============================================================

def main():
    print("\n" + "="*60)
    print("🍽️  TasteBud ML Ingredient Matcher")
    print("="*60 + "\n")
    
    # ---------------------------------------------------------
    # Step 1: Connect to databases
    # ---------------------------------------------------------
    print("📡 Connecting to databases...")
    
    try:
        # Connect to Atlas (ingredients)
        atlas_client = MongoClient(MONGO_ATLAS_URI)
        atlas_db = atlas_client[ATLAS_DB_NAME]
        ingredients_col = atlas_db["ingredients"]
        
        # Test connection
        ingredient_count = ingredients_col.count_documents({})
        print(f"   ✅ Atlas connected - {ingredient_count:,} ingredients")
    except Exception as e:
        print(f"   ❌ Atlas connection failed: {e}")
        return
    
    try:
        # Connect to Foods DB (branded foods)
        foods_client = MongoClient(MONGO_FOODS_URI)
        foods_db = foods_client[FOODS_DB_NAME]
        branded_col = foods_db["brandedfoods"]
        
        # Test connection
        branded_count = branded_col.count_documents({})
        print(f"   ✅ Foods DB connected - {branded_count:,} branded products")
    except Exception as e:
        print(f"   ❌ Foods DB connection failed: {e}")
        print("   Make sure the external MongoDB server is running!")
        return
    
    # ---------------------------------------------------------
    # Step 2: Load AI model
    # ---------------------------------------------------------
    print(f"\n🤖 Loading AI model ({MODEL_NAME})...")
    print("   (First run downloads ~90MB model)")
    
    model = SentenceTransformer(MODEL_NAME)
    print("   ✅ Model loaded")
    
    # ---------------------------------------------------------
    # Step 3: Create embeddings for all ingredients
    # ---------------------------------------------------------
    print("\n📊 Creating embeddings for ingredient database...")
    
    # Load all ingredients
    ingredients = list(ingredients_col.find({}, {"_id": 1, "name": 1, "foodGroup": 1}))
    print(f"   Found {len(ingredients)} ingredients")
    
    # Create ingredient names list for embedding
    ingredient_names = [ing["name"] for ing in ingredients]
    
    # Generate embeddings (this uses your M4 chip efficiently)
    print("   Generating embeddings (this takes ~30 seconds)...")
    ingredient_embeddings = model.encode(
        ingredient_names, 
        show_progress_bar=True,
        convert_to_numpy=True
    )
    
    print(f"   ✅ Created {len(ingredient_embeddings)} embeddings")
    
    # Create lookup dict: embedding index -> ingredient data
    ingredient_lookup = {i: ingredients[i] for i in range(len(ingredients))}
    
    # ---------------------------------------------------------
    # Step 4: Process branded foods
    # ---------------------------------------------------------
    print("\n🏭 Processing branded food ingredients...")
    
    # Create/clear the mappings collection
    mappings_col = atlas_db["ingredient_mappings"]
    
    # Check if we already have mappings
    existing_count = mappings_col.count_documents({})
    if existing_count > 0:
        print(f"   Found {existing_count:,} existing mappings")
        response = input("   Delete and rebuild? (y/n): ").strip().lower()
        if response == 'y':
            mappings_col.delete_many({})
            print("   Cleared existing mappings")
        else:
            print("   Keeping existing mappings, will add new ones")
    
    # Get all unique ingredient strings from branded foods
    print("\n   Extracting unique ingredients from branded foods...")
    
    # We'll process in batches to avoid memory issues
    unique_ingredients = set()
    
    cursor = branded_col.find({}, {"ingredients": 1})
    for doc in tqdm(cursor, total=branded_count, desc="   Scanning"):
        for ing in doc.get("ingredients", []):
            if ing and not should_skip(ing):
                cleaned = clean_ingredient(ing)
                if cleaned and len(cleaned) > 1:
                    unique_ingredients.add((ing, cleaned))  # (original, cleaned)
    
    print(f"\n   Found {len(unique_ingredients):,} unique ingredient strings")
    
    # ---------------------------------------------------------
    # Step 5: Match ingredients using AI
    # ---------------------------------------------------------
    print("\n🔍 Matching ingredients using AI similarity...")
    
    # Convert to list for processing
    ingredients_to_match = list(unique_ingredients)
    
    # Process in batches
    mappings_to_insert = []
    matched_count = 0
    unmatched_count = 0
    
    for i in tqdm(range(0, len(ingredients_to_match), BATCH_SIZE), desc="   Matching"):
        batch = ingredients_to_match[i:i + BATCH_SIZE]
        
        # Get cleaned names for this batch
        cleaned_names = [item[1] for item in batch]
        
        # Create embeddings for batch
        batch_embeddings = model.encode(cleaned_names, convert_to_numpy=True)
        
        # Find best match for each
        for j, (original, cleaned) in enumerate(batch):
            query_embedding = batch_embeddings[j]
            
            # Calculate cosine similarity with all ingredients
            similarities = np.dot(ingredient_embeddings, query_embedding) / (
                np.linalg.norm(ingredient_embeddings, axis=1) * np.linalg.norm(query_embedding)
            )
            
            # Get best match
            best_idx = np.argmax(similarities)
            best_score = similarities[best_idx]
            
            if best_score >= MIN_SIMILARITY:
                matched_ingredient = ingredient_lookup[best_idx]
                
                mapping = {
                    "original": original,
                    "cleaned": cleaned,
                    "matchedId": matched_ingredient["_id"],
                    "matchedName": matched_ingredient["name"],
                    "foodGroup": matched_ingredient.get("foodGroup", ""),
                    "similarity": float(best_score),
                    "createdAt": datetime.utcnow()
                }
                mappings_to_insert.append(mapping)
                matched_count += 1
            else:
                unmatched_count += 1
        
        # Insert batch to avoid memory buildup
        if len(mappings_to_insert) >= 1000:
            mappings_col.insert_many(mappings_to_insert)
            mappings_to_insert = []
    
    # Insert remaining
    if mappings_to_insert:
        mappings_col.insert_many(mappings_to_insert)
    
    # ---------------------------------------------------------
    # Step 6: Create index for fast lookups
    # ---------------------------------------------------------
    print("\n📇 Creating database index...")
    mappings_col.create_index("original", unique=True)
    mappings_col.create_index("matchedName")
    print("   ✅ Index created")
    
    # ---------------------------------------------------------
    # Summary
    # ---------------------------------------------------------
    print("\n" + "="*60)
    print("✅ COMPLETE!")
    print("="*60)
    print(f"\n   Matched:   {matched_count:,} ingredients")
    print(f"   Unmatched: {unmatched_count:,} ingredients (below {MIN_SIMILARITY} similarity)")
    print(f"   Total:     {matched_count + unmatched_count:,}")
    print(f"\n   Match rate: {matched_count / (matched_count + unmatched_count) * 100:.1f}%")
    
    final_count = mappings_col.count_documents({})
    print(f"\n   Mappings in database: {final_count:,}")
    
    # Show some examples
    print("\n📋 Sample mappings:")
    samples = list(mappings_col.find().limit(10))
    for s in samples:
        print(f"   '{s['original'][:40]:<40}' → {s['matchedName']:<25} ({s['similarity']:.2f})")
    
    print("\n🎉 Your branded food matching is now AI-powered!")
    print("   Next: Update your backend to use the 'ingredient_mappings' collection\n")

if __name__ == "__main__":
    main()
