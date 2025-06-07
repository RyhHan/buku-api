const express = require('express');
const router = express.Router();
const { addBook, getBooks, deleteBook, updateBook } = require('../controllers/bookController');
const upload = require('../server');  // Mengimpor upload dari server.js

// Menambah Buku dengan upload gambar
router.post('/', upload.single('cover'), addBook);  // 'cover' adalah nama field file di form-data

// Mengambil Buku
router.get('/', getBooks);  // Endpoint untuk mengambil semua buku

// Menghapus Buku
router.delete('/:bookId', deleteBook);  // Endpoint untuk menghapus buku berdasarkan ID

// Mengupdate Buku dengan upload gambar
router.put('/:bookId', upload.single('cover'), updateBook);  // 'cover' adalah nama field file di form-data

module.exports = router;
