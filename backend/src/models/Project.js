const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    category: { type: String, enum: ["Web Development", "Mobile Development", "Design", "Writing", "web", "mobile", "design", "writing"] },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    liveUrl: { type: String },
    repoUrl: { type: String },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

projectSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model("Project", projectSchema);
