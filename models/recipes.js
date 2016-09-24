var mongoose = require("mongoose")

var recipeSchema = new mongoose.Schema ({
    title: String,
    image: String,
    summary: String,
    calories: String,
    carb: String,
    protein: String,
    fat: String,
    step1: String,
    step2: String,
    step3: String,
    step4: String,
    step5: String,
    step6: String,
    step7: String
});

module.exports = mongoose.model("Recipe", recipeSchema);