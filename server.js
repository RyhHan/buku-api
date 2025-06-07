const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const db = require('./config/db');  // Mengimpor koneksi database
const bodyParser = require('body-parser');
require('dotenv').config();

// Menentukan penyimpanan untuk gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Menyimpan gambar di folder 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Menyimpan file dengan nama unik
    }
});

// Membuat instance Multer
const upload = multer({ storage: storage });

// Mengekspor upload agar bisa digunakan di file lain
module.exports = upload;

// Middleware
app.use(bodyParser.json());  // Untuk parsing JSON body

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MariaDB/MySQL database');
    }
});

// Rute untuk API buku
app.use('/api/books', require('./routes/bookRoutes'));  // Menambahkan rute buku tanpa autentikasi

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
