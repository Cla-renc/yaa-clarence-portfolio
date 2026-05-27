const SiteConfig = require('../models/SiteConfig');

const getSiteConfig = async (req, res) => {
    try {
        const configs = await SiteConfig.find({}).lean();
        const data = configs.reduce((acc, config) => {
            acc[config.key] = config.value;
            return acc;
        }, {});
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to load site config' });
    }
};

const getSiteConfigByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const config = await SiteConfig.findOne({ key }).lean();
        if (!config) {
            return res.status(404).json({ success: false, message: 'Config item not found' });
        }
        return res.status(200).json({ success: true, data: config.value });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to load site config item' });
    }
};

const updateSiteConfig = async (req, res) => {
    try {
        const { key } = req.params;
        const { value, type } = req.body;

        if (typeof value === 'undefined') {
            return res.status(400).json({ success: false, message: 'Config value is required' });
        }

        const config = await SiteConfig.findOneAndUpdate(
            { key },
            { value, type: type || (typeof value), updatedAt: new Date() },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save site config' });
    }
};

module.exports = { getSiteConfig, getSiteConfigByKey, updateSiteConfig };