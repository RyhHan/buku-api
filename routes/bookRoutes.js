const express = require('express');
const router = express.Router();
const { addBook, getBooks, deleteBook, updateBook } = require('../controllers/bookController');
const { verifyToken } = require('../middleware/authMiddleware');  // Mengimpor middleware autentikasi
const upload = require('../server');  // Mengimpor upload dari server.js

// Menambah Buku dengan upload gambar
router.post('/', verifyToken, upload.single('cover'), (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.author || !req.body.status) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }
    addBook(req.body.title, req.body.description, req.body.author, req.body.status, req.file.filename, req.user.email)
        .then((newBook) => {
            res.status(201).json({
                status: 'success',
                message: 'Book added successfully',
                data: newBook
            });
        })
        .catch((err) => {
            res.status(500).json({ msg: 'Error adding book', error: err.message });
        });
});

// Mengambil Buku berdasarkan User ID
router.get('/', verifyToken, (req, res) => {
    getBooks(req.user.email)
        .then((books) => {
            res.json(books);
        })
        .catch((err) => {
            res.status(500).json({ msg: 'Error fetching books', error: err.message });
        });
});

// Menghapus Buku berdasarkan ID
router.delete('/:bookId', verifyToken, (req, res) => {
    deleteBook(req.params.bookId, req.user.email)
        .then((result) => {
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Book not found or not authorized to delete' });
            }
            res.json({ status: 'success', message: 'Book deleted successfully' });
        })
        .catch((err) => {
            res.status(500).json({ msg: 'Error deleting book', error: err.message });
        });
});

// Mengupdate Buku dengan upload gambar
router.put('/:bookId', verifyToken, upload.single('cover'), (req, res) => {
    const { title, description, author, status } = req.body;
    const cover = req.file ? req.file.filename : '';  // Dapatkan nama file gambar baru

    if (!title || !description || !author || !status) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    updateBook(req.params.bookId, title, description, author, status, cover, req.user.email)
        .then((updatedBook) => {
            res.json({
                status: 'success',
                message: 'Book updated successfully',
                data: updatedBook
            });
        })
        .catch((err) => {
            res.status(500).json({ msg: 'Error updating book', error: err.message });
        });
});

module.exports = router;
