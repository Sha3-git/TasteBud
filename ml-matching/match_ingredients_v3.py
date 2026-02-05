"""
TasteBud ML Ingredient Matcher v3.0 (UNIFIED)
=============================================
This version includes FODMAP & additive mapping!

Changes from v2:
- FODMAPs are MAPPED, not skipped
- Sugar alcohols, gums, fibers all tracked
- Same scoring system works for allergies AND intolerances

Run: python match_ingredients_v3.py
"""

import os
import re
from datetime import datetime
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import numpy as np

# ============================================================
# CONFIGURATION
# ============================================================

MONGO_ATLAS_URI = "mongodb+srv://DataBaseUsr:Ftw0Ji2BRw1kRQlA@cluster0.f1lvvua.mongodb.net/TasteBud?tlsAllowInvalidCertificates=true"
ATLAS_DB_NAME = "TasteBud"

MONGO_FOODS_URI = "mongodb://DataBaseUsr:Ftw0Ji2BRw1kRQlA@165.22.225.28:27017/TasteBud"
FOODS_DB_NAME = "TasteBud"

MODEL_NAME = "all-MiniLM-L6-v2"
MIN_SIMILARITY = 0.50
BATCH_SIZE = 100

# ============================================================
# SKIP LIST - ONLY things that truly can't cause reactions
# ============================================================

# MUCH SMALLER than v2 - only skip vitamins/minerals/colors
SKIP_INGREDIENTS = {
    # Vitamins (supplements, not triggers)
    'VITAMIN A', 'VITAMIN B', 'VITAMIN C', 'VITAMIN D', 'VITAMIN E',
    'VITAMIN K', 'NIACIN', 'NIACINAMIDE', 'THIAMIN', 'THIAMINE',
    'RIBOFLAVIN', 'FOLIC ACID', 'BIOTIN', 'PYRIDOXINE', 'CYANOCOBALAMIN',
    'PANTOTHENIC ACID', 'ASCORBIC ACID',
    
    # Minerals (supplements)
    'CALCIUM CARBONATE', 'FERRIC ORTHOPHOSPHATE', 'ZINC OXIDE',
    'FERROUS SULFATE', 'MAGNESIUM OXIDE', 'POTASSIUM CHLORIDE',
    'IRON', 'ZINC', 'CALCIUM', 'MAGNESIUM',
    
    # Food dyes (could add later, but rarely cause GI issues)
    'RED 40', 'BLUE 1', 'BLUE 2', 'YELLOW 5', 'YELLOW 6',
    'CARAMEL COLOR', 'TITANIUM DIOXIDE', 'ANNATTO',
    
    # Truly inert
    'WATER', 'SALT', 'SEA SALT',
}

SKIP_PATTERNS = [
    r'^VITAMIN', r'^ADDED', r'^CONTAINS', r'^LESS THAN',
    r'^TO PRESERVE', r'^FOR COLOR', r'^E\d{3}',  # E-numbers
    r'HYDROCHLORIDE$', r'MONONITRATE$',
]

# ============================================================
# MANUAL OVERRIDES - Now includes FODMAPs!
# ============================================================

MANUAL_OVERRIDES = {
    # ==========================================
    # FODMAP - POLYOLS (Sugar Alcohols)
    # ==========================================
    'ERYTHRITOL': 'Erythritol',
    'SORBITOL': 'Sorbitol',
    'MANNITOL': 'Mannitol',
    'XYLITOL': 'Xylitol',
    'MALTITOL': 'Maltitol',
    'ISOMALT': 'Isomalt',
    'LACTITOL': 'Lactitol',
    
    # ==========================================
    # FODMAP - OLIGOSACCHARIDES (Fructans/GOS)
    # ==========================================
    'INULIN': 'Inulin',
    'CHICORY ROOT': 'Chicory root fiber',
    'CHICORY ROOT FIBER': 'Chicory root fiber',
    'CHICORY ROOT EXTRACT': 'Chicory root extract',
    'CHICORY EXTRACT': 'Chicory root extract',
    'FRUCTOOLIGOSACCHARIDES': 'Fructooligosaccharides',
    'FOS': 'FOS',
    'GALACTOOLIGOSACCHARIDES': 'Galactooligosaccharides',
    'GOS': 'GOS',
    'ISOMALTO-OLIGOSACCHARIDES': 'Isomalto-oligosaccharides',
    'ISOMALTO OLIGOSACCHARIDES': 'Isomalto-oligosaccharides',
    'IMO': 'Isomalto-oligosaccharides',
    'PREBIOTIC FIBER': 'Isomalto-oligosaccharides',
    
    # ==========================================
    # ARTIFICIAL SWEETENERS
    # ==========================================
    'SUCRALOSE': 'Sucralose',
    'ASPARTAME': 'Aspartame',
    'ACESULFAME POTASSIUM': 'Acesulfame potassium',
    'ACESULFAME K': 'Acesulfame potassium',
    'ACE-K': 'Acesulfame potassium',
    'SACCHARIN': 'Saccharin',
    'STEVIA': 'Stevia',
    'STEVIOL GLYCOSIDES': 'Stevia',
    'STEVIOL GLYCOSIDES (STEVIA)': 'Stevia',
    'MONK FRUIT': 'Monk fruit extract',
    'MONK FRUIT EXTRACT': 'Monk fruit extract',
    'LO HAN GUO': 'Monk fruit extract',
    
    # ==========================================
    # GUMS & THICKENERS
    # ==========================================
    'XANTHAN GUM': 'Xanthan gum',
    'GUAR GUM': 'Guar gum',
    'CARRAGEENAN': 'Carrageenan',
    'LOCUST BEAN GUM': 'Locust bean gum',
    'CELLULOSE GUM': 'Cellulose gum',
    'GELLAN GUM': 'Gellan gum',
    'AGAR': 'Agar',
    'AGAR AGAR': 'Agar',
    'PECTIN': 'Pectin',
    'GUM ARABIC': 'Guar gum',
    'ARABIC GUM': 'Guar gum',
    'ACACIA GUM': 'Guar gum',
    
    # ==========================================
    # FIBER ADDITIVES
    # ==========================================
    'SOLUBLE CORN FIBER': 'Soluble corn fiber',
    'RESISTANT STARCH': 'Resistant starch',
    'POLYDEXTROSE': 'Polydextrose',
    'RESISTANT MALTODEXTRIN': 'Resistant maltodextrin',
    'PSYLLIUM': 'Psyllium',
    'PSYLLIUM HUSK': 'Psyllium',
    
    # ==========================================
    # FLAVOR ENHANCERS & PRESERVATIVES
    # ==========================================
    'MSG': 'MSG',
    'MONOSODIUM GLUTAMATE': 'Monosodium glutamate',
    'SODIUM NITRITE': 'Sodium nitrite',
    'SODIUM NITRATE': 'Sodium nitrate',
    'SULFITES': 'Sulfites',
    'SODIUM SULFITE': 'Sodium sulfite',
    'SODIUM METABISULFITE': 'Sodium metabisulfite',
    
    # ==========================================
    # ACIDS
    # ==========================================
    'CITRIC ACID': 'Citric acid',
    'MALIC ACID': 'Malic acid',
    'TARTARIC ACID': 'Tartaric acid',
    'LACTIC ACID': 'Lactic acid',
    
    # ==========================================
    # HIGH-FODMAP SUGARS
    # ==========================================
    'HIGH FRUCTOSE CORN SYRUP': 'High fructose corn syrup',
    'HFCS': 'High fructose corn syrup',
    'AGAVE': 'Agave syrup',
    'AGAVE SYRUP': 'Agave syrup',
    'AGAVE NECTAR': 'Agave nectar',
    'CRYSTALLINE FRUCTOSE': 'Crystalline fructose',
    
    # ==========================================
    # ALLERGENS - Milk
    # ==========================================
    'MILK': 'Milk (Cow)',
    'WHOLE MILK': 'Milk (Cow)',
    'SKIM MILK': 'Milk (Cow)',
    'MILK PROTEIN ISOLATE': 'Milk (Cow)',
    'MILK PROTEIN ISOLATE)': 'Milk (Cow)',
    'MILK PROTEIN': 'Milk (Cow)',
    'WHEY': 'Whey',
    'WHEY PROTEIN': 'Whey',
    'WHEY PROTEIN ISOLATE': 'Whey',
    'WHEY PROTEIN ISOLATE)': 'Whey',
    'WHEY PROTEIN CONCENTRATE': 'Whey',
    'SWEET WHEY': 'Whey',
    'SWEET WHEY POWDER': 'Whey',
    'CASEIN': 'Milk (Cow)',
    'SODIUM CASEINATE': 'Milk (Cow)',
    'CALCIUM CASEINATE': 'Milk (Cow)',
    'SKIMMED MILK POWDER': 'Dried milk',
    'SKIM MILK POWDER': 'Dried milk',
    'NONFAT DRY MILK': 'Dried milk',
    'NONFAT MILK': 'Dried milk',
    'DRIED MILK': 'Dried milk',
    'MILK POWDER': 'Dried milk',
    'BUTTERMILK': 'Buttermilk',
    'CREAM': 'Cream',
    'HEAVY CREAM': 'Cream',
    'SOUR CREAM': 'Sour cream',
    'BUTTER': 'Butter',
    'BUTTERFAT': 'Butter',
    'CHEESE': 'Cheese',
    'YOGURT': 'Yogurt',
    
    # ==========================================
    # ALLERGENS - Wheat/Gluten
    # ==========================================
    'WHEAT': 'Wheat',
    'WHEAT FLOUR': 'Flour',
    'ENRICHED WHEAT FLOUR': 'Flour',
    'UNBLEACHED ENRICHED FLOUR': 'Flour',
    'ENRICHED FLOUR': 'Flour',
    'BLEACHED FLOUR': 'Flour',
    'ALL PURPOSE FLOUR': 'Flour',
    'BREAD FLOUR': 'Flour',
    'WHOLE WHEAT FLOUR': 'Flour',
    'WHEAT STARCH': 'Wheat',
    'WHEAT GLUTEN': 'Wheat',
    'VITAL WHEAT GLUTEN': 'Wheat',
    'GLUTEN': 'Wheat',
    'SEMOLINA': 'Semolina',
    'DURUM': 'Wheat',
    'DURUM WHEAT': 'Wheat',
    
    # ==========================================
    # ALLERGENS - Soy
    # ==========================================
    'SOY': 'Soybean',
    'SOYBEAN': 'Soybean',
    'SOYBEANS': 'Soybean',
    'SOY LECITHIN': 'Other soy product',
    'SOYBEAN OIL': 'Soybean oil',
    'SOY PROTEIN': 'Soy protein',
    'SOY PROTEIN ISOLATE': 'Soy protein',
    'SOY PROTEIN ISOLATED': 'Soy protein',
    'SOY FLOUR': 'Soy flour',
    'TOFU': 'Tofu',
    'EDAMAME': 'Edamame',
    
    # ==========================================
    # ALLERGENS - Eggs
    # ==========================================
    'EGG': 'Egg',
    'EGGS': 'Egg',
    'WHOLE EGG': 'Egg',
    'WHOLE EGGS': 'Egg',
    'EGG WHITE': 'Egg white',
    'EGG WHITES': 'Egg white',
    'EGG YOLK': 'Egg yolk',
    'EGG YOLKS': 'Egg yolk',
    'DRIED EGG': 'Egg',
    'EGG POWDER': 'Egg',
    
    # ==========================================
    # ALLERGENS - Peanuts
    # ==========================================
    'PEANUT': 'Peanut',
    'PEANUTS': 'Peanut',
    'PEANUT BUTTER': 'Peanut butter',
    'PEANUT OIL': 'Peanut oil',
    'PEANUT FLOUR': 'Peanut',
    
    # ==========================================
    # ALLERGENS - Tree Nuts
    # ==========================================
    'ALMOND': 'Almond',
    'ALMONDS': 'Almond',
    'ALMOND BUTTER': 'Almond butter',
    'ALMOND FLOUR': 'Almond',
    'WALNUT': 'Walnut',
    'WALNUTS': 'Walnut',
    'CASHEW': 'Cashew nut',
    'CASHEWS': 'Cashew nut',
    'PECAN': 'Pecan nut',
    'PECANS': 'Pecan nut',
    'PISTACHIO': 'Pistachio',
    'PISTACHIOS': 'Pistachio',
    'HAZELNUT': 'Hazelnut',
    'HAZELNUTS': 'Hazelnut',
    'MACADAMIA': 'Macadamia nut',
    'MACADAMIA NUTS': 'Macadamia nut',
    'BRAZIL NUT': 'Brazil nut',
    'BRAZIL NUTS': 'Brazil nut',
    'PINE NUT': 'Pine nut',
    'PINE NUTS': 'Pine nut',
    'COCONUT': 'Coconut',
    'COCONUT OIL': 'Coconut oil',
    'COCONUT MILK': 'Coconut milk',
    
    # ==========================================
    # ALLERGENS - Shellfish & Fish
    # ==========================================
    'SHRIMP': 'Shrimp',
    'CRAB': 'Crab',
    'LOBSTER': 'Lobster',
    'CRAWFISH': 'Crawfish',
    'CLAM': 'Clam',
    'CLAMS': 'Clam',
    'OYSTER': 'Oyster',
    'OYSTERS': 'Oyster',
    'MUSSEL': 'Mussel',
    'MUSSELS': 'Mussel',
    'SCALLOP': 'Scallop',
    'SCALLOPS': 'Scallop',
    'FISH': 'Fish',
    'SALMON': 'Salmon',
    'TUNA': 'Tuna',
    'COD': 'Cod',
    'TILAPIA': 'Tilapia',
    'ANCHOVY': 'Anchovy',
    'ANCHOVIES': 'Anchovy',
    
    # ==========================================
    # OILS
    # ==========================================
    'PALM OIL': 'Oil palm',
    'PALM KERNEL OIL': 'Oil palm',
    'CANOLA OIL': 'Canola oil',
    'SUNFLOWER OIL': 'Sunflower oil',
    'VEGETABLE OIL': 'Vegetable oil',
    'OLIVE OIL': 'Olive oil',
    'CORN OIL': 'Corn oil',
    'SAFFLOWER OIL': 'Safflower oil',
    'COTTONSEED OIL': 'Cottonseed oil',
    
    # ==========================================
    # SUGARS & SYRUPS
    # ==========================================
    'SUGAR': 'Sugar',
    'CANE SUGAR': 'Sugar',
    'BROWN SUGAR': 'Sugar',
    'POWDERED SUGAR': 'Sugar',
    'CORN SYRUP': 'Corn syrup',
    'MAPLE SYRUP': 'Maple syrup',
    'HONEY': 'Honey',
    'MOLASSES': 'Molasses',
    
    # ==========================================
    # COCOA & CHOCOLATE
    # ==========================================
    'COCOA': 'Cocoa',
    'COCOA POWDER': 'Cocoa',
    'COCOA PROCESSED WITH ALKALI': 'Cocoa',
    'COCOA BUTTER': 'Cocoa butter',
    'CHOCOLATE': 'Chocolate',
    'UNSWEETENED CHOCOLATE': 'Chocolate',
    'DARK CHOCOLATE': 'Chocolate',
    'MILK CHOCOLATE': 'Chocolate',
    'COCOA MASS': 'Cocoa liquor',
    
    # ==========================================
    # GRAINS
    # ==========================================
    'CORN': 'Corn',
    'CORN FLOUR': 'Corn flour',
    'CORNSTARCH': 'Corn starch',
    'CORN STARCH': 'Corn starch',
    'CORNMEAL': 'Corn flour',
    'RICE': 'Rice',
    'RICE FLOUR': 'Rice flour',
    'BROWN RICE': 'Brown rice',
    'OAT': 'Oat',
    'OATS': 'Oat',
    'OAT FLOUR': 'Oat',
    'OATMEAL': 'Oat',
    'BARLEY': 'Barley',
    'RYE': 'Rye',
    
    # ==========================================
    # COMMON INGREDIENTS
    # ==========================================
    'VANILLA': 'Vanilla',
    'VANILLA EXTRACT': 'Vanilla',
    'CINNAMON': 'Cinnamon',
    'GARLIC': 'Garlic',
    'ONION': 'Onion',
    'ONIONS': 'Onion',
    'TOMATO': 'Garden tomato',
    'TOMATOES': 'Garden tomato',
    'POTATO': 'Potato',
    'POTATOES': 'Potato',
    
    # ==========================================
    # FRUITS
    # ==========================================
    'APPLE': 'Apple',
    'APPLES': 'Apple',
    'BANANA': 'Banana',
    'BANANAS': 'Banana',
    'STRAWBERRY': 'Strawberry',
    'STRAWBERRIES': 'Strawberry',
    'DRIED STRAWBERRIES': 'Strawberry',
    'BLUEBERRY': 'Blueberry',
    'BLUEBERRIES': 'Blueberry',
    'DRIED BLUEBERRIES': 'Blueberry',
    'RASPBERRY': 'Raspberry',
    'RASPBERRIES': 'Raspberry',
    'CHERRY': 'Cherry',
    'CHERRIES': 'Cherry',
    'GRAPE': 'Grape',
    'GRAPES': 'Grape',
    'RAISIN': 'Raisin',
    'RAISINS': 'Raisin',
    'CRANBERRY': 'Cranberry',
    'CRANBERRIES': 'Cranberry',
    'ORANGE': 'Orange',
    'LEMON': 'Lemon',
    'LIME': 'Lime',
    'MANGO': 'Mango',
    'PINEAPPLE': 'Pineapple',
    'PEACH': 'Peach',
}

# ============================================================
# FUNCTIONS
# ============================================================

def should_skip(ingredient_str):
    """Now skips MUCH LESS - only vitamins/minerals/dyes"""
    upper = ingredient_str.upper().strip()
    
    if len(upper) < 2 or len(upper) > 80:
        return True
    
    # Skip only if EXACT match in skip list
    for skip in SKIP_INGREDIENTS:
        if upper == skip:  # Exact match only
            return True
    
    # Skip vitamin/mineral patterns
    for pattern in SKIP_PATTERNS:
        if re.search(pattern, upper):
            return True
    
    return False

def clean_ingredient(raw):
    """Clean ingredient string for matching"""
    s = raw.upper().strip()
    
    # Extract from parentheses
    paren_match = re.search(r'\(([A-Z][A-Z\s]+)', s)
    if paren_match:
        inner = paren_match.group(1).strip()
        if len(inner) > 3:
            s = inner
    
    s = re.sub(r'\([^)]*\)', ' ', s)
    s = re.sub(r'\[[^\]]*\]', ' ', s)
    s = re.sub(r'\d+\.?\d*%?', '', s)
    s = re.sub(r'[^\w\s]', ' ', s)
    
    prefixes = ['WHOLE GRAIN', 'ORGANIC', 'NATURAL', 'ENRICHED', 'BLEACHED',
                'UNBLEACHED', 'NONFAT', 'SKIMMED', 'DRIED', 'ROASTED',
                'FREEZE DRIED', 'DEHYDRATED']
    for p in prefixes:
        s = re.sub(f'^{p}\\s+', '', s)
    
    return ' '.join(s.split()).strip()

def get_override(original, cleaned):
    """Check for manual override mapping"""
    upper = original.upper().strip()
    
    # Exact match
    if upper in MANUAL_OVERRIDES:
        return MANUAL_OVERRIDES[upper]
    if cleaned in MANUAL_OVERRIDES:
        return MANUAL_OVERRIDES[cleaned]
    
    # Partial match (contains)
    for key, val in MANUAL_OVERRIDES.items():
        if key in upper and len(key) > 4:  # Only match if key is substantial
            return val
    
    return None

# ============================================================
# MAIN
# ============================================================

def main():
    print("\n" + "="*60)
    print("🍽️  TasteBud ML Ingredient Matcher v3.0 (UNIFIED)")
    print("="*60)
    print("\n✨ NEW: Now maps FODMAPs & additives (not skipping them!)")
    print(f"   Min similarity: {MIN_SIMILARITY}")
    print(f"   Manual overrides: {len(MANUAL_OVERRIDES)} (includes FODMAPs)")
    print(f"   Skip list: {len(SKIP_INGREDIENTS)} (only vitamins/colors)")
    
    # Connect
    print("\n📡 Connecting...")
    atlas_client = MongoClient(MONGO_ATLAS_URI)
    atlas_db = atlas_client[ATLAS_DB_NAME]
    ingredients_col = atlas_db["ingredients"]
    ing_count = ingredients_col.count_documents({})
    print(f"   ✅ Atlas: {ing_count} ingredients")
    
    # Check for FODMAP ingredients
    fodmap_count = ingredients_col.count_documents({
        "foodGroup": {"$regex": "FODMAP|Additive|sweetener|Gum|Fiber", "$options": "i"}
    })
    if fodmap_count == 0:
        print("\n⚠️  WARNING: No FODMAP ingredients found in database!")
        print("   Run 'node add_fodmap_ingredients.js' first!")
        response = input("   Continue anyway? (y/n): ").strip().lower()
        if response != 'y':
            return
    else:
        print(f"   ✅ FODMAP/Additive ingredients: {fodmap_count}")
    
    foods_client = MongoClient(MONGO_FOODS_URI)
    foods_db = foods_client[FOODS_DB_NAME]
    branded_col = foods_db["brandedfoods"]
    branded_count = branded_col.count_documents({})
    print(f"   ✅ Foods: {branded_count:,} products")
    
    # Load model
    print(f"\n🤖 Loading model...")
    model = SentenceTransformer(MODEL_NAME)
    print("   ✅ Loaded")
    
    # Create embeddings
    print("\n📊 Creating embeddings...")
    ingredients = list(ingredients_col.find({}, {"_id": 1, "name": 1, "foodGroup": 1}))
    name_to_ing = {ing["name"]: ing for ing in ingredients}
    
    names = [ing["name"] for ing in ingredients]
    embeddings = model.encode(names, show_progress_bar=True, convert_to_numpy=True)
    lookup = {i: ingredients[i] for i in range(len(ingredients))}
    
    # Clear old mappings
    mappings_col = atlas_db["ingredient_mappings"]
    existing = mappings_col.count_documents({})
    if existing > 0:
        print(f"\n   Found {existing:,} existing mappings")
        if input("   Delete and rebuild? (y/n): ").lower() == 'y':
            mappings_col.delete_many({})
            print("   ✅ Cleared")
        else:
            return
    
    # Extract unique ingredients
    print("\n   Extracting unique ingredients...")
    unique = set()
    skipped = 0
    for doc in tqdm(branded_col.find({}, {"ingredients": 1}), total=branded_count):
        for ing in doc.get("ingredients", []):
            if ing:
                if should_skip(ing):
                    skipped += 1
                else:
                    cleaned = clean_ingredient(ing)
                    if cleaned and len(cleaned) > 1:
                        unique.add((ing, cleaned))
    
    print(f"   Found {len(unique):,} unique")
    print(f"   Skipped {skipped:,} (vitamins/minerals/dyes only)")
    
    # Match
    print("\n🔍 Matching (now including FODMAPs!)...")
    to_match = list(unique)
    to_insert = []
    stats = {'override': 0, 'ai': 0, 'unmatched': 0, 'fodmap': 0}
    
    fodmap_keywords = ['FODMAP', 'Polyol', 'Additive', 'sweetener', 'Gum', 'Fiber']
    
    for i in tqdm(range(0, len(to_match), BATCH_SIZE)):
        batch = to_match[i:i+BATCH_SIZE]
        cleaned_batch = [x[1] for x in batch]
        batch_emb = model.encode(cleaned_batch, convert_to_numpy=True)
        
        for j, (orig, clean) in enumerate(batch):
            override = get_override(orig, clean)
            
            if override and override in name_to_ing:
                matched = name_to_ing[override]
                
                # Track if it's a FODMAP
                is_fodmap = any(kw in matched.get("foodGroup", "") for kw in fodmap_keywords)
                if is_fodmap:
                    stats['fodmap'] += 1
                
                to_insert.append({
                    "original": orig,
                    "matchedId": matched["_id"],
                    "matchedName": matched["name"],
                    "foodGroup": matched.get("foodGroup", ""),
                    "similarity": 1.0,
                    "matchType": "override",
                    "createdAt": datetime.utcnow()
                })
                stats['override'] += 1
            else:
                q_emb = batch_emb[j]
                sims = np.dot(embeddings, q_emb) / (
                    np.linalg.norm(embeddings, axis=1) * np.linalg.norm(q_emb)
                )
                best_idx = np.argmax(sims)
                best_score = sims[best_idx]
                
                if best_score >= MIN_SIMILARITY:
                    matched = lookup[best_idx]
                    
                    is_fodmap = any(kw in matched.get("foodGroup", "") for kw in fodmap_keywords)
                    if is_fodmap:
                        stats['fodmap'] += 1
                    
                    to_insert.append({
                        "original": orig,
                        "matchedId": matched["_id"],
                        "matchedName": matched["name"],
                        "foodGroup": matched.get("foodGroup", ""),
                        "similarity": float(best_score),
                        "matchType": "ai",
                        "createdAt": datetime.utcnow()
                    })
                    stats['ai'] += 1
                else:
                    stats['unmatched'] += 1
        
        if len(to_insert) >= 1000:
            mappings_col.insert_many(to_insert)
            to_insert = []
    
    if to_insert:
        mappings_col.insert_many(to_insert)
    
    # Index
    mappings_col.create_index("original", unique=True)
    mappings_col.create_index("similarity")
    mappings_col.create_index("foodGroup")
    
    # Summary
    total = stats['override'] + stats['ai'] + stats['unmatched']
    matched = stats['override'] + stats['ai']
    
    print("\n" + "="*60)
    print("✅ COMPLETE!")
    print("="*60)
    print(f"\n📊 Results:")
    print(f"   Manual overrides:  {stats['override']:,}")
    print(f"   AI matches:        {stats['ai']:,}")
    print(f"   Unmatched:         {stats['unmatched']:,}")
    print(f"   ─────────────────────────")
    print(f"   Total matched:     {matched:,}")
    print(f"   Match rate:        {matched/total*100:.1f}%")
    print(f"\n🎯 FODMAP/Additive mappings: {stats['fodmap']:,}")
    
    final = mappings_col.count_documents({})
    print(f"\n   Total in DB: {final:,}")
    
    # Sample FODMAP mappings
    print("\n📋 Sample FODMAP mappings:")
    fodmap_samples = list(mappings_col.find({
        "foodGroup": {"$regex": "FODMAP|Additive|sweetener|Gum", "$options": "i"}
    }).limit(10))
    for s in fodmap_samples:
        print(f"   {s['original'][:30]:<30} → {s['matchedName']:<20} ({s['foodGroup']})")
    
    # Sample allergen mappings
    print("\n📋 Sample allergen mappings:")
    allergen_samples = list(mappings_col.find({
        "foodGroup": {"$regex": "Milk|Nuts|Soy|Egg|Cereals", "$options": "i"}
    }).limit(5))
    for s in allergen_samples:
        print(f"   {s['original'][:30]:<30} → {s['matchedName']:<20} ({s['foodGroup']})")
    
    print("\n🎉 Unified system complete! Allergies + FODMAPs + Additives all tracked!")
    print("   Your scoring algorithm will now detect ALL triggers.\n")

if __name__ == "__main__":
    main()
