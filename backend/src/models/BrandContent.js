const mongoose = require("mongoose");

const brandContentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String },
    content: { type: String, required: true },
    platform: { type: String, enum: ["Facebook", "TikTok", "Instagram", "Other"] },
    metrics: {
        likes: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        comments: { type: Number, default: 0 }
    },
    url: { type: String },
    createdAt: { type: Date, default: Date.now }
});
brandContentSchema.index({ type: 1, platform: 1 });
module.exports = mongoose.model("BrandContent", brandContentSchema);
