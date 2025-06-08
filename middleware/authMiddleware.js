const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('997739123782-tjc0ls9gv32o3hf406pr19e0ksedcb2q.apps.googleusercontent.com');  // Ganti dengan Web Client ID Anda

async function verifyToken(req, res, next) {
    const idToken = req.headers['authorization'];  // Mengambil ID token dari header Authorization

    if (!idToken) {
        return res.status(403).json({ message: 'No token provided' });  // Menangani jika token tidak ada
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: 'YOUR_WEB_CLIENT_ID',  // Ganti dengan Web Client ID Anda
        });

        const payload = ticket.getPayload();
        req.user = payload;  // Menyimpan data pengguna yang sudah terverifikasi
        next();  // Melanjutkan ke handler berikutnya jika token valid
    } catch (error) {
        console.error('Error verifying token', error);
        return res.status(403).json({ message: 'Invalid token' });  // Menangani kesalahan token tidak valid
    }
}

module.exports = { verifyToken };
