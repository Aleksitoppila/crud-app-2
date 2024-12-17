// models/revokedToken.js


// Imports
const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema({
    jti: { 
        type: String, 
        required: true, 
        unique: true 
    },
    exp: { 
        type: Date, 
        required: true 
    },
}, {
    timestamps: true,
});

const cleanupExpiredRevokedTokens = async () => {
    try {
        const result = await RevokedToken.deleteMany({ exp: { $lt: new Date() } });

        console.log(`Removed ${result.deletedCount} expired revoked tokens.`);
    } catch (error) {
        console.error('Error cleaning up expired revoked tokens:', error);
    }
};

// Daily cleanup
setInterval(cleanupExpiredRevokedTokens, 24 * 60 * 60 * 1000);

revokedTokenSchema.index({ exp: 1 });

module.exports = mongoose.model('RevokedToken', revokedTokenSchema, '_revokedTokens');