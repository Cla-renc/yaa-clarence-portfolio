const BlogPost = require('../models/BlogPost');

const getBlogPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({}).sort({ createdAt: -1 }).populate('author', 'name');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createBlogPost = async (req, res) => {
    try {
        const { title, excerpt, content, mediaUrl, mediaType } = req.body;
        const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() : Date.now().toString();

        const post = new BlogPost({
            title,
            excerpt,
            content,
            slug,
            isPublished: true,
            author: req.user._id
        });

        if (req.file?.path) {
            const mimeType = req.file.mimetype || '';
            const type = mimeType.startsWith('video/') ? 'video' : 'image';
            post.mediaUrl = req.file.path;
            post.mediaType = type;
            if (type === 'image') post.featuredImage = req.file.path;
        } else if (mediaUrl) {
            post.mediaUrl = mediaUrl;
            const normalizedType = mediaType === 'video' || /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(mediaUrl) || /tiktok\.com|youtube\.com|youtu\.be|vimeo\.com/i.test(mediaUrl) ? 'video' : 'image';
            post.mediaType = normalizedType;
            if (normalizedType === 'image') post.featuredImage = mediaUrl;
        }

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteBlogPost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (post) {
            await BlogPost.deleteOne({ _id: post._id });
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getBlogPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        // Try finding by slug first, fall back to _id
        let post = await BlogPost.findOne({ slug }).populate('author', 'name');
        if (!post) post = await BlogPost.findById(slug).populate('author', 'name').catch(() => null);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getBlogPosts, getBlogPostBySlug, createBlogPost, deleteBlogPost };
