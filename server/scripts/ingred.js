const fs = require("fs");
const XLSX = require("xlsx");

const foods = JSON.parse(fs.readFileSync("your_path/Food.json", "utf-8"));

const workbook = XLSX.readFile("your_path/COMPARE-2025-01-27-25.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const allergensSheet = XLSX.utils.sheet_to_json(sheet);

const allergens = allergensSheet.map(row => ({
  allergen_id: row["Allergen ID"],
  species: row["Species"],
  common_name: row["Common Name"],
  iuis_name: row["IUIS Name"] || "",
  description: row["Description"],
  accession: row["Accession"],
  parent_accession: row["Parent Accession"] || null,
  year: row["Year Adopted"]
}));

function parseFasta(text) {
  const entries = {};
  let currentAcc = null;
  let currentSeq = [];

  text.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (line.startsWith(">")) {
      if (currentAcc) entries[currentAcc] = currentSeq.join("");
      currentAcc = line.split(" ")[0].replace(">", "").trim();
      currentSeq = [];
    } else if (line !== "") {
      currentSeq.push(line);
    }
  });

  if (currentAcc) entries[currentAcc] = currentSeq.join("");
  return entries;
}

const fastaText = fs.readFileSync("your_path/COMPARE2025-FastA-Seq-01-27-2025.txt", "utf-8");
const fastaSequences = parseFasta(fastaText);

function normalize(str) {
  return str ? str.toLowerCase().trim() : null;
}

let finalFoods = [];

for (const food of foods) {
  let scientificName = food.name_scientific || null;

  const matchedAllergens = allergens
    .filter(a => normalize(a.species) === normalize(scientificName))
    .map(a => ({
      allergen_id: a.allergen_id,
      iuis_name: a.iuis_name,
      description: a.description,
      accession: a.accession,
      protein_sequence: fastaSequences[a.accession] || null
    }));

  finalFoods.push({
    name: food.name,
    scientific_name: scientificName,
    group: food.food_group,
    subgroup: food.food_subgroup,
    description: food.description,
    has_sub_ingredients: false,
    sub_ingredients: [],
    extra_ingredients: [],
    allergens: matchedAllergens
  });
}

const existingAccessions = new Set(
  finalFoods.flatMap(f => f.allergens.map(a => a.accession))
);

for (const a of allergens) {
  if (existingAccessions.has(a.accession)) continue;

  const commonNameNorm = normalize(a.common_name);
  const speciesNorm = normalize(a.species);

  let existing = finalFoods.find(f =>
    normalize(f.name) === commonNameNorm ||
    normalize(f.scientific_name) === speciesNorm
  );

  const newAllergenObj = {
    allergen_id: a.allergen_id,
    iuis_name: a.iuis_name,
    description: a.description,
    accession: a.accession,
    protein_sequence: fastaSequences[a.accession] || null
  };

  if (existing) {
    existing.allergens.push(newAllergenObj);
  } else {
    finalFoods.push({
      name: a.common_name || null,
      scientific_name: a.species || null,
      group: null,
      subgroup: null,
      description: a.description || null,
      has_sub_ingredients: false,
      sub_ingredients: [],
      extra_ingredients: [],
      allergens: [newAllergenObj]
    });
  }
}

fs.writeFileSync(
  "your_path/final_foods.json",
  JSON.stringify(finalFoods, null, 2)
);

console.log("Done! ᕦ(ò_óˇ)ᕤ");
