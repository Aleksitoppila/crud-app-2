// models/userModel.js

// Imports
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    birthday: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Moderator', 'Support', 'User', 'Project Manager', 'Project Worker'],
    },
    profilePicture: {
        type: String,
        default: 'https://fontawesome.com/icons/user?f=classic&s=solid',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

userSchema.index({ email: 1 });

// Set first and lastname first character to be uppercase
userSchema.pre('save', function(next) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();

    next();
});

module.exports = mongoose.model('userModel', userSchema, '_users');
