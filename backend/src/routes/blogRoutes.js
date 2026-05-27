const express = require('express');
const router = express.Router();
const { getBlogPosts, getBlogPostBySlug, createBlogPost, deleteBlogPost } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getBlogPosts)
    .post(protect, admin, upload.single('media'), createBlogPost);

router.route('/:slug')
    .get(getBlogPostBySlug)
    .delete(protect, admin, deleteBlogPost);

module.exports = router;
