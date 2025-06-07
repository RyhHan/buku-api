const db = require('../config/db');
const fs = require('fs');  // Import fs untuk menghapus file

// Menambahkan Buku dengan gambar
exports.addBook = (req, res) => {
    const { title, description, author, status } = req.body;
    const cover = req.file ? req.file.path : '';  // Mendapatkan path gambar yang di-upload

    // Validasi input
    if (!title || !description || !author || !status || !cover) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    // Menambah buku ke database
    db.query('INSERT INTO books (title, description, author, status, cover) VALUES (?, ?, ?, ?, ?)', 
    [title, description, author, status, cover], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
    });
};

// Mengambil Buku
exports.getBooks = (req, res) => {
    db.query('SELECT * FROM books', (err, result) => {
        if (err) throw err;
        res.json(result);  // Mengirimkan daftar buku
    });
};

// Menghapus Buku
exports.deleteBook = (req, res) => {
    const { bookId } = req.params;

    db.query('SELECT cover FROM books WHERE id = ?', [bookId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).json({ msg: 'Book not found' });
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
        db.query('DELETE FROM books WHERE id = ?', [bookId], (err, result) => {
            if (err) throw err;
            res.json({ msg: 'Book deleted successfully' });
        });
    });
};

// Mengupdate Buku
exports.updateBook = (req, res) => {
    const { bookId } = req.params;  // Mengambil ID buku dari parameter
    const { title, description, author, status } = req.body;
    const cover = req.file ? req.file.path : null;  // Mendapatkan path gambar yang di-upload (jika ada)

    // Validasi input
    if (!title || !description || !author || !status) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    // Menyiapkan query untuk mengupdate buku
    let query = 'UPDATE books SET title = ?, description = ?, author = ?, status = ?';
    let values = [title, description, author, status];

    // Jika ada gambar yang di-upload, kita akan memperbarui field cover
    if (cover) {
        query += ', cover = ?';
        values.push(cover);
    }

    query += ' WHERE id = ?';  // Menambahkan kondisi untuk buku yang akan di-update
    values.push(bookId);

    // Mengambil file lama yang akan dihapus
    db.query('SELECT cover FROM books WHERE id = ?', [bookId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).json({ msg: 'Book not found' });
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
