const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }

    try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user_id = decoded.user_id;
    req.user = await User.findById(decoded.user_id).select('-password');
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, user not found'
        });
    }

    next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }

};

module.exports = { protect };