const db = require('../config/db');

// Menambahkan buku baru
const addBook = (title, description, author, status, cover) => {
    const query = 'INSERT INTO books (title, description, author, status, cover) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, description, author, status, cover], (err, result) => {
        if (err) throw err;
        console.log('Book added with ID:', result.insertId);
    });
};

// Mengambil semua buku
const getBooksByUserId = (userId, callback) => {
    const query = 'SELECT * FROM books';  // Mengambil semua buku (tanpa filter user)
    db.query(query, (err, result) => {
        if (err) throw err;
        callback(result);  // Mengembalikan hasil query
    });
};

// Menghapus buku berdasarkan ID
const deleteBookById = (bookId, callback) => {
    const query = 'DELETE FROM books WHERE id = ?';
    db.query(query, [bookId], (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

module.exports = { addBook, getBooksByUserId, deleteBookById };
