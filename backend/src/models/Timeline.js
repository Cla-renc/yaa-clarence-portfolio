const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
    type: { type: String, enum: ["Education", "Experience", "Certification"], default: "Experience" }
});
timelineSchema.index({ startDate: -1 });
module.exports = mongoose.model("Timeline", timelineSchema);
