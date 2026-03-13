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

module.exports = {
    EXCLUDED_INGREDIENTS
};