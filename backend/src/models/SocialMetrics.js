const mongoose = require("mongoose");

const socialMetricsSchema = new mongoose.Schema({
    platform: { 
        type: String, 
        enum: ["facebook", "tiktok", "twitter", "linkedin"],
        required: true 
    },
    followers: { type: Number, required: true },
    following: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Compound index for efficient querying
socialMetricsSchema.index({ platform: 1, date: -1 });

module.exports = mongoose.model("SocialMetrics", socialMetricsSchema);
