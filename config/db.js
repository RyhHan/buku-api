const mysql = require('mysql2');
require('dotenv').config();  // Memuat variabel lingkungan dari .env

// Menggunakan URL koneksi dari variabel lingkungan
const db = mysql.createConnection(process.env.DB_URL);

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
