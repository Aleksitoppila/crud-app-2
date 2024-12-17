// routes/userRoute.js


// Imports
import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    userSignIn, 
    userLogout 
} from '../controllers/userController.js';

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
export default router;