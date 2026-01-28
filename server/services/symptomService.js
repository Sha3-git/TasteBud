const Symptom = require("../models/symptom")

const searchSymptoms = async (query, limit = 20) => {
  try {
    if (!query || query.trim() === "") return [];

    const q = query.trim();

    const results = await Symptom.find({
      name: { $regex: q, $options: "i" }
    })
    .limit(limit);

    return results;
  } catch (err) {
    console.error(err);
    return [];
  }
};


module.exports = {
  searchSymptoms
};
