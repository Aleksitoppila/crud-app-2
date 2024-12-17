// middleware/verifyToken.js

// Imports
import jwt from 'jsonwebtoken';
import RevokedToken from '../models/revokedToken.js';

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token result in error
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Decode and verify JWT token with JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const revokedToken = await RevokedToken.findOne({ jti: decoded.jti || decoded._id });

        // Check that token is not in revoked
        if (revokedToken) {
            return res.status(403).json({ message: 'Token has been revoked. Please log in again.' });
        }

        // If token is not revoked attach decoded user information to the "req.user" object
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error during token verification:', err);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// Exports
export default verifyToken;