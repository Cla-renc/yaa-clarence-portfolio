const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true },
    subject: { type: String, required: true, maxlength: 150 },
    message: { type: String, required: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now, index: -1 }
});

contactSchema.index({ read: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model("Contact", contactSchema);
