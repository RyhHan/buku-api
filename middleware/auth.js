const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'Token not found, please login' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;  // Menyimpan data user yang terautentikasi
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};
