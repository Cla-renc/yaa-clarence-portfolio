const express = require('express');
const router = express.Router();
const { getBooks, createBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

let upload;
try {
    upload = require('../middleware/uploadMiddleware');
} catch (e) {
    // Basic fallback if upload middleware is temporarily faulty
    upload = { single: () => (req, res, next) => next() };
}

router.route('/')
    .get(getBooks)
    .post(protect, admin, createBook);

router.route('/upload')
    .post(protect, admin, upload.single('image'), (req, res) => {
        res.send({ imageUrl: req.file?.path || '' });
    });

router.route('/:id')
    .delete(protect, admin, deleteBook);

module.exports = router;
