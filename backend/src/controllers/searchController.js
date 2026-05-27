const Book = require("../models/Book");
const BlogPost = require("../models/BlogPost");
const Project = require("../models/Project");

const globalSearch = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const searchRegex = new RegExp(query, 'i');

        // Search Books
        const books = await Book.find({
            $or: [
                { title: searchRegex },
                { synopsis: searchRegex },
                { genre: searchRegex }
            ]
        }).select('title synopsis genre coverImage slug _id').limit(5);

        // Search Blog Posts
        const blogs = await BlogPost.find({
            $or: [
                { title: searchRegex },
                { excerpt: searchRegex },
                { content: searchRegex }
            ]
        }).select('title excerpt slug featuredImage createdAt _id').limit(5);

        // Search Projects
        const projects = await Project.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { techStack: searchRegex }
            ]
        }).select('title description slug thumbnail techStack _id').limit(5);

        res.json({
            books,
            blogs,
            projects
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { globalSearch };
