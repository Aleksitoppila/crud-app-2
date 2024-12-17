// routes/mainRoute.js

// Imports
const express = require('express');
router = express.Router();

// Index
router.get('/', (req, res) => {
    try {
        res.status(200).json({ message: 'Connection established' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Exports
module.exports = router;
