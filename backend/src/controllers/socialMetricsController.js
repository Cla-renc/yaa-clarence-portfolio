const SocialMetrics = require("../models/SocialMetrics");
const AnalyticsEvent = require("../models/AnalyticsEvent");

// @desc    Get social metrics for all platforms or specific platform
// @route   GET /api/social-metrics?platform=facebook
// @access  Public
exports.getSocialMetrics = async (req, res, next) => {
    try {
        const { platform, limit = 30 } = req.query;
        
        let query = {};
        if (platform) {
            query.platform = platform.toLowerCase();
        }

        const metrics = await SocialMetrics
            .find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: metrics
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get latest metrics for all platforms
// @route   GET /api/social-metrics/latest
// @access  Public
exports.getLatestMetrics = async (req, res, next) => {
    try {
        const platforms = ["facebook", "tiktok", "twitter", "linkedin"];
        const latestMetrics = {};

        for (const platform of platforms) {
            const metric = await SocialMetrics
                .findOne({ platform })
                .sort({ date: -1 });
            if (metric) {
                latestMetrics[platform] = metric;
            }
        }

        res.status(200).json({
            success: true,
            data: latestMetrics
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new social metrics entry (Admin only)
// @route   POST /api/social-metrics
// @access  Private/Admin
exports.createSocialMetrics = async (req, res, next) => {
    try {
        const { platform, followers, following, posts, engagementRate, likes, comments, shares } = req.body;

        const metrics = new SocialMetrics({
            platform: platform.toLowerCase(),
            followers,
            following,
            posts,
            engagementRate,
            likes,
            comments,
            shares,
            date: new Date()
        });

        await metrics.save();

        res.status(201).json({
            success: true,
            data: metrics
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get metrics history for trend analysis
// @route   GET /api/social-metrics/history/:platform
// @access  Public
exports.getMetricsHistory = async (req, res, next) => {
    try {
        const { platform } = req.params;
        const { days = 90 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const history = await SocialMetrics
            .find({
                platform: platform.toLowerCase(),
                date: { $gte: startDate }
            })
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Collect public analytics/event (lightweight tracking)
// @route   POST /api/social-metrics/collect
// @access  Public
exports.collectEvent = async (req, res, next) => {
    try {
        const { eventType = 'pageview', page, path, metadata = {} } = req.body || {};

        const event = new AnalyticsEvent({
            eventType,
            page,
            path,
            referrer: req.get('Referrer') || req.get('Referer') || '',
            userAgent: req.get('User-Agent') || '',
            ip: req.ip,
            metadata
        });

        try {
            await event.save();
            return res.status(201).json({ success: true });
        } catch (saveErr) {
            console.warn('Analytics save failed (DB may be unavailable):', saveErr.message);
            // Best-effort: accept event even if DB unavailable
            return res.status(201).json({ success: true, saved: false });
        }
    } catch (err) {
        console.error('Analytics collect error:', err);
        // Accept event anyway to avoid breaking frontend analytics
        res.status(201).json({ success: true, saved: false });
    }
};
