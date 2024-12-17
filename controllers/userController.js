// controllers/userController.js

// Imports
import userModel from '../models/userModel.js';
import RevokedToken from '../models/revokedToken.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// GET All users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET User by ID 
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {

        // Find user by id
        const user = await userModel.findById(id);

        // Check that user exists
        if (!user) {
            return res.status(404).json({ message: "User with this ID doesn't exist" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST New user
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, gender, birthday, email, password, role, profilePicture, createdDate } = req.body;

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate email format
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate birthday date
        let parsedBirthday = null;
        if (birthday) {
            parsedBirthday = new Date(birthday);
            if (isNaN(parsedBirthday)) {
                return res.status(400).json({ message: "Invalid birthday format" });
            }
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new userModel({
            firstName,
            lastName,
            gender,
            birthday,
            email,
            password: hashedPassword,
            role,
            profilePicture,
            createdDate
        });

        // Save new user
        const addedUser = await newUser.save();
        res.status(201).json(addedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PATCH Existing user
export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, gender, birthday, email, password, profilePicture } = req.body;

        // Create updated data
        const updatedData = {
            firstName,
            lastName,
            gender,
            birthday,
            email,
            profilePicture
        };

        // Hash updated password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
        }

        // Find user and update 
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        // Check that user exits
        if (!updatedUser) {
            return res.status(404).json({ message: "User with this ID doesn't exist" });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE Existing user
export const deleteUser = async (req, res) => {
    try {
        
        // Find user and delete
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);

        // Check that user exits
        if (!deletedUser) {
            return res.status(404).json({ message: "User with this ID doesn't exist" });
        }
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST login
export const userSignIn = async (req, res) => {
    let { email, password } = req.body;

    // Trim whitespaces from email and password
    email = email.trim();
    password = password.trim();

    // Check that fields are not empty
    if (email === "" || password === "") {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {

        // Check that email exists in _users
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare hashed and inputed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Check that password exists in _users
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
        );

        res.status(200).json({ 
            message: 'Login successful',
            token: token,
        });

    } catch (err) {
        console.error("Error during sign-in:", err);
        res.status(500).json({ message: "An error occurred while checking for existing user" });
    }
};

// POST logout
export const userLogout = async (req, res) => {

    // Extract JWT token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no token result in error
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {

        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Use jti identifier or fallback to _id
        const jti = decoded.jti || decoded._id;

        // Check if the token is already revoked
        const existingRevokedToken = await RevokedToken.findOne({ jti });

        if (existingRevokedToken) {
            return res.status(200).json({ message: 'User already logged out. Token already revoked.' });
        }

        // Create new entry in RevokedToken collection
        const revokedToken = new RevokedToken({
            jti, 
            exp: new Date(decoded.exp * 1000)
        });

        // Save the revoked token to the database
        await revokedToken.save();

        return res.status(200).json({ message: 'Logged out successfully, token revoked.' });

    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(400).json({ message: 'Invalid token or token expired' });
    }
};

// Exports
export default 'userController';