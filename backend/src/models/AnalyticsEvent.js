const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
    eventType: { type: String, required: true },
    page: { type: String },
    path: { type: String },
    referrer: { type: String },
    userAgent: { type: String },
    ip: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
});

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
