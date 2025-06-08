const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('./middleware/authMiddleware');  // Impor middleware
const app = express();

// Set up multer untuk upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Simpan dengan nama unik
    }
});
const upload = multer({ storage: storage });

// Endpoint untuk mendapatkan daftar buku
app.get('/api/books', verifyToken, (req, res) => {  // Gunakan middleware verifyToken di sini
    res.json(books);  // Menampilkan data buku
});

// Endpoint untuk menambah buku
app.post('/api/books', verifyToken, upload.single('cover'), (req, res) => {
    const { title, description, author, status } = req.body;
    const cover = req.file ? req.file.filename : '';

    const newBook = { id: Date.now(), title, description, author, status, cover };
    books.push(newBook);

    res.status(201).json({ status: 'success', message: 'Book added successfully', data: newBook });
});

// Endpoint untuk menghapus buku
app.delete('/api/books', verifyToken, (req, res) => {
    const { id } = req.query;

    const bookIndex = books.findIndex(book => book.id === parseInt(id));

    if (bookIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Book not found' });
    }

    // Hapus buku dari array
    books.splice(bookIndex, 1);

    res.json({ status: 'success', message: 'Book deleted successfully' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
