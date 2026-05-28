const express = require('express');
const router = express.Router();
const { getBlogPosts, getBlogPostBySlug, createBlogPost, deleteBlogPost, likeBlogPost, addComment } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getBlogPosts)
    .post(protect, admin, createBlogPost);

router.route('/upload')
    .post(protect, admin, upload.single('image'), (req, res) => {
        res.send({ imageUrl: req.file?.path || '' });
    });

router.route('/:slug')
    .get(getBlogPostBySlug)
    .delete(protect, admin, deleteBlogPost);

router.route('/:id/like')
    .post(likeBlogPost);

router.route('/:id/comment')
    .post(addComment);

module.exports = router;
