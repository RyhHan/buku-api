const mysql = require('mysql2');  // Menggunakan mysql2 untuk koneksi MariaDB

// Membuat koneksi ke database MySQL/MariaDB
const db = mysql.createConnection({
    host: 'localhost',      // Ganti dengan host MariaDB Anda (misalnya localhost)
    user: 'root',           // Ganti dengan username MariaDB Anda
    password: '',           // Ganti dengan password MariaDB Anda
    database: 'buku_api'    // Ganti dengan nama database Anda
});

// Mengecek koneksi
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MariaDB/MySQL database');
    }
});

// Mengekspor objek db yang mengandung koneksi
module.exports = db;
