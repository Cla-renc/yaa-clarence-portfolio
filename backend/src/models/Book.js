const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    synopsis: { type: String, required: true },
    genre: { type: String, required: true },
    audience: { type: String },
    status: { type: String, default: "Writing" },
    coverImage: { type: String },
    price: { type: Number, default: 0 },
    isForSale: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Book", bookSchema);
