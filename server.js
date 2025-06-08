const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('./middleware/authMiddleware');  // Impor middleware
const app = express();

// Set up multer untuk upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Menyimpan gambar di folder 'uploads'
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Simpan file dengan nama unik
    }
});
const upload = multer({ storage: storage });

app.get('/api/public-books', (req, res) => {
    // Mengambil semua buku tanpa filter userId
    res.json(books);  // Mengembalikan semua buku
});

// Simulasi data buku (dalam aplikasi nyata ini bisa menggunakan database)
let books = [
    { id: 1, title: 'Book Title 1', description: 'Description 1', author: 'Author 1', status: 'Not Read', cover: 'cover1.jpg', userId: 'user123' },
    { id: 2, title: 'Book Title 2', description: 'Description 2', author: 'Author 2', status: 'Reading', cover: 'cover2.jpg', userId: 'user124' }
];

// Endpoint untuk mendapatkan daftar buku
app.get('/api/books', verifyToken, (req, res) => {
    const userId = req.user.email;  // Ambil ID pengguna dari token
    const userBooks = books.filter(book => book.userId === userId);  // Filter hanya buku milik pengguna
    res.json(userBooks);  // Menampilkan data buku yang sesuai
});

// Endpoint untuk menambah buku
app.post('/api/books', verifyToken, upload.single('cover'), (req, res) => {
    const { title, description, author, status } = req.body;
    const cover = req.file ? req.file.filename : '';
    const userId = req.user.email;  // Ambil userId dari token

    // Menambahkan buku baru
    const newBook = { id: Date.now(), title, description, author, status, cover, userId };
    books.push(newBook);

    res.status(201).json({ status: 'success', message: 'Book added successfully', data: newBook });
});

// Endpoint untuk menghapus buku
app.delete('/api/books', verifyToken, (req, res) => {
    const { id } = req.query;
    const userId = req.user.email;  // Ambil userId dari token

    const bookIndex = books.findIndex(book => book.id === parseInt(id) && book.userId === userId);

    if (bookIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Book not found or not authorized to delete' });
    }

    // Hapus buku dari array
    books.splice(bookIndex, 1);

    res.json({ status: 'success', message: 'Book deleted successfully' });
});

// Menjalankan server
app.listen(5000, () => console.log('Server running on port 5000'));
