const db = require('../config/db');
const fs = require('fs');  // Import fs untuk menghapus file

// Menambahkan buku baru
exports.addBook = (req, res) => {
    const { title, description, author, status } = req.body;
    const cover = req.file ? req.file.path : '';  // Mendapatkan path gambar yang di-upload

    // Pengecekan untuk setiap field dan memberikan pesan error yang lebih spesifik
    if (!title) {
        return res.status(400).json({ msg: 'Title is required' });
    }
    if (!description) {
        return res.status(400).json({ msg: 'Description is required' });
    }
    if (!author) {
        return res.status(400).json({ msg: 'Author is required' });
    }
    if (!status) {
        return res.status(400).json({ msg: 'Status is required' });
    }
    if (!cover) {
        return res.status(400).json({ msg: 'Cover image is required' });
    }

    // Jika semua field sudah ada, lanjutkan untuk menambah buku ke database
    const userId = req.user.email;  // Mengambil userId dari token autentikasi
    const query = 'INSERT INTO books (title, description, author, status, cover, userId) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [title, description, author, status, cover, userId], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
    });
};

// Mengambil Buku berdasarkan UserId
exports.getBooks = (req, res) => {
    const userId = req.user.email;  // Mengambil userId dari token autentikasi
    const query = 'SELECT * FROM books WHERE userId = ?';  // Mengambil buku berdasarkan userId
    
    db.query(query, [userId], (err, result) => {
        if (err) throw err;
        res.json(result);  // Mengirimkan daftar buku milik pengguna yang terautentikasi
    });
};

// Menghapus Buku berdasarkan ID dan UserId
exports.deleteBook = (req, res) => {
    const { bookId } = req.params;
    const userId = req.user.email;  // Mengambil userId dari token autentikasi

    // Menemukan buku berdasarkan bookId dan userId
    const findQuery = 'SELECT cover FROM books WHERE id = ? AND userId = ?';
    db.query(findQuery, [bookId, userId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).json({ msg: 'Book not found or unauthorized' });
        }

        // Menghapus file lama jika ada
        const oldCover = result[0].cover;
        if (oldCover) {
            fs.unlink(oldCover, (err) => {
                if (err) console.error('Error deleting old cover image:', err);
                else console.log('Old cover image deleted');
            });
        }

        // Menghapus buku dari database
        const deleteQuery = 'DELETE FROM books WHERE id = ? AND userId = ?';
        db.query(deleteQuery, [bookId, userId], (err, result) => {
            if (err) throw err;
            res.json({ msg: 'Book deleted successfully' });
        });
    });
};

// Mengupdate Buku berdasarkan ID dan UserId
exports.updateBook = (req, res) => {
    const { bookId } = req.params;  // Mengambil ID buku dari parameter
    const { title, description, author, status } = req.body;
    const cover = req.file ? req.file.path : null;  // Mendapatkan path gambar yang di-upload (jika ada)

    // Validasi input
    if (!title || !description || !author || !status) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    const userId = req.user.email;  // Mengambil userId dari token autentikasi

    // Menyiapkan query untuk mengupdate buku
    let query = 'UPDATE books SET title = ?, description = ?, author = ?, status = ?';
    let values = [title, description, author, status];

    // Jika ada gambar yang di-upload, kita akan memperbarui field cover
    if (cover) {
        query += ', cover = ?';
        values.push(cover);
    }

    query += ' WHERE id = ? AND userId = ?';  // Menambahkan kondisi untuk buku yang akan di-update
    values.push(bookId, userId);

    // Mengambil file lama yang akan dihapus
    db.query('SELECT cover FROM books WHERE id = ? AND userId = ?', [bookId, userId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).json({ msg: 'Book not found or unauthorized' });
        }

        const oldCover = result[0].cover;

        // Jika ada gambar baru yang di-upload dan gambar lama berbeda, hapus gambar lama
        if (cover && oldCover && oldCover !== cover) {
            fs.unlink(oldCover, (err) => {
                if (err) console.error('Error deleting old cover image:', err);
                else console.log('Old cover image deleted');
            });
        }

        // Menjalankan query untuk mengupdate buku
        db.query(query, values, (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Book not found' });
            }
            res.json({ msg: 'Book updated successfully' });
        });
    });
};
