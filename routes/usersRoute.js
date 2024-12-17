// routes/userRoute.js

// Imports
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    userSignIn,
    userLogout
} = require('../controllers/userController');

// GET all users
router.get('/', verifyToken, getAllUsers);

// GET user by ID
router.get('/:id', verifyToken, getUserById);

// POST new user
router.post('/add', verifyToken, createUser);

// POST login
router.post('/login', userSignIn);

// POST logout
router.post('/logout', verifyToken, userLogout);

// PATCH existing user
router.patch('/update/:id', verifyToken, updateUser);

// DELETE existing user
router.delete('/delete/:id', verifyToken, deleteUser);

// Exports
module.exports = router;