const db = require('../config/db');

// Menambahkan buku baru
const addBook = async (title, description, author, status, cover, userId) => {
    try {
        const query = 'INSERT INTO books (title, description, author, status, cover, userId) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [title, description, author, status, cover, userId]);
        console.log('Book added with ID:', result.insertId);
        return result.insertId;  // Mengembalikan ID buku yang baru ditambahkan
    } catch (err) {
        throw new Error('Error adding book: ' + err.message);
    }
};

// Mengambil semua buku berdasarkan userId
const getBooksByUserId = async (userId) => {
    try {
        const query = 'SELECT * FROM books WHERE userId = ?';  // Filter berdasarkan userId
        const [result] = await db.promise().query(query, [userId]);
        return result;  // Mengembalikan hasil query
    } catch (err) {
        throw new Error('Error fetching books: ' + err.message);
    }
};

// Menghapus buku berdasarkan ID
const deleteBookById = async (bookId) => {
    try {
        const query = 'DELETE FROM books WHERE id = ?';
        const [result] = await db.promise().query(query, [bookId]);
        return result;  // Mengembalikan hasil penghapusan
    } catch (err) {
        throw new Error('Error deleting book: ' + err.message);
    }
};

module.exports = { addBook, getBooksByUserId, deleteBookById };
