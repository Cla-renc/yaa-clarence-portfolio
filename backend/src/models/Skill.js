const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: Number, min: 1, max: 100 },
    icon: { type: String }
});
skillSchema.index({ category: 1 });
module.exports = mongoose.model("Skill", skillSchema);
