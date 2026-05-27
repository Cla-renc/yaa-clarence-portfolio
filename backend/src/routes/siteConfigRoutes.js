const express = require('express');
const router = express.Router();
const { getSiteConfig, getSiteConfigByKey, updateSiteConfig } = require('../controllers/siteConfigController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSiteConfig);

router.route('/:key')
    .get(getSiteConfigByKey)
    .put(protect, admin, updateSiteConfig);

module.exports = router;
