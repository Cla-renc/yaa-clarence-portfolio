const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    tags: [{ type: String }],
    categories: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false },
    featuredImage: { type: String },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video'] },
    createdAt: { type: Date, default: Date.now }
});
blogPostSchema.index({ title: "text", content: "text" });
module.exports = mongoose.model("BlogPost", blogPostSchema);
