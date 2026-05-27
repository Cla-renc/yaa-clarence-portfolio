const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    author: { type: String, required: true },
    role: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
testimonialSchema.index({ approved: 1 });
module.exports = mongoose.model("Testimonial", testimonialSchema);
