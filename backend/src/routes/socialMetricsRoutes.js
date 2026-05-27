const express = require('express');
const router = express.Router();
const { 
    getSocialMetrics, 
    getLatestMetrics, 
    createSocialMetrics,
    collectEvent,
    getMetricsHistory 
} = require('../controllers/socialMetricsController');
const { protect, admin } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimitMiddleware');

// Public routes
router.get('/', getSocialMetrics);
router.get('/latest', getLatestMetrics);
router.get('/history/:platform', getMetricsHistory);

// Admin routes
router.post('/', protect, admin, createSocialMetrics);

// Public lightweight collection endpoint (used by frontend analytics)
router.post('/collect', apiLimiter, collectEvent);

module.exports = router;
