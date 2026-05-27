const Book = require('../models/Book');

const getBooks = async (req, res) => {
    try {
        const books = await Book.find({}).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createBook = async (req, res) => {
    try {
        const bookData = { ...req.body };
        if (req.file && req.file.path) {
            bookData.coverImage = req.file.path;
        }
        const book = new Book(bookData);
        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            await Book.deleteOne({ _id: book._id });
            res.json({ message: 'Book removed' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getBooks, createBook, deleteBook };
