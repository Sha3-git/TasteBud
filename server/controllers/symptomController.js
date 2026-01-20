const symptomService = require("../services/symptomService")

const searchSymptoms = async (req, res) =>{
    try{
        const {q, limit} = req.query;
        const symptom = await symptomService.searchSymptoms(q)
        res.json(symptom)
    }catch(err){
        console.log(err)
    }
}
module.exports ={
    searchSymptoms
}