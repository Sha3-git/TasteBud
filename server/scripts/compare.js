const fs = require("fs");
const path = require("path");

const foods = JSON.parse(
  fs.readFileSync(
    "your_path/final_foods.json",
    "utf-8"
  )
);

const tsvPath = path.join(
  "your_path/crossreac.tsv"
);
const lines = fs.readFileSync(tsvPath, "utf-8").trim().split("\n");

const accessionToFood = {};
for (const food of foods) {
  if (food.allergens) {
    for (const allergen of food.allergens) {
      accessionToFood[allergen.accession] = {
        name: food.name,
        scientific_name: food.scientific_name,
        protein_sequence: allergen.protein_sequence
      };
    }
  }
}

const pairs = [];
for (const line of lines) {
  const [qseqid, sseqid, pidentStr] = line.split("\t");
  const pident = parseFloat(pidentStr);
  if (pident < 50) continue;

  const food1 = accessionToFood[qseqid];
  const food2 = accessionToFood[sseqid];
  if (!food1 || !food2) continue;

  pairs.push({ food1, food2, similarity_score: pident });
}

const parent = {};
function find(x) {
  if (!parent[x]) parent[x] = x;
  if (parent[x] !== x) parent[x] = find(parent[x]);
  return parent[x];
}
function union(x, y) {
  const px = find(x);
  const py = find(y);
  if (px !== py) parent[px] = py;
}

function makeID(food) {
  return food.name;
}

for (const { food1, food2 } of pairs) {
  union(makeID(food1), makeID(food2));
}

const groupsMap = {};
const foodProteinMap = {};

for (const food of foods) {
  if (food.allergens) {
    for (const allergen of food.allergens) {
      const obj = {
        name: food.name,
        scientific_name: food.scientific_name,
        protein_sequence: allergen.protein_sequence,
        similarity_scores: {}
      };

      const id = makeID(obj);
      const rootID = find(id);

      if (!groupsMap[rootID]) groupsMap[rootID] = [];
      groupsMap[rootID].push(obj);

      foodProteinMap[id] = obj;
    }
  }
}

for (const { food1, food2, similarity_score } of pairs) {
  const id1 = makeID(food1);
  const id2 = makeID(food2);

  if (foodProteinMap[id1] && foodProteinMap[id2]) {
    foodProteinMap[id1].similarity_scores[id2] = similarity_score;
    foodProteinMap[id2].similarity_scores[id1] = similarity_score;
  }
}

const groups = Object.values(groupsMap);
function collapseDuplicates(groups) {
  const cleaned = [];

  for (const group of groups) {
    const byFood = {};

    for (const item of group) {
      const foodName = item.name;

      const maxScore =
        Object.values(item.similarity_scores).length > 0
          ? Math.max(...Object.values(item.similarity_scores))
          : 0;

      if (!byFood[foodName]) {
        byFood[foodName] = { item, score: maxScore };
      } else {
        if (maxScore > byFood[foodName].score) {
          byFood[foodName] = { item, score: maxScore };
        }
      }
    }

    cleaned.push(Object.values(byFood).map((v) => v.item));
  }

  return cleaned;
}

let cleanedGroups = collapseDuplicates(groups);
function removeSelfSimilarities(groups) {
  return groups.map(group =>
    group.map(entry => {
      const newScores = {};

      for (const [name, score] of Object.entries(entry.similarity_scores)) {
        if (name.toLowerCase() !== entry.name.toLowerCase()) {
          newScores[name] = score;
        }
      }

      return {
        ...entry,
        similarity_scores: newScores
      };
    })
  );
}

cleanedGroups = removeSelfSimilarities(cleanedGroups);
fs.writeFileSync(
  "your_path/cross_reac.json",
  JSON.stringify(cleanedGroups, null, 2)
);

console.log("Done! ✔ Self-similarities removed, duplicates collapsed.");
