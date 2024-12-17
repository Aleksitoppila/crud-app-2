// models/projectModel.js

// Imports
const mongoose = require('mongoose');
const User = require('./userModel');

const projectSchema = mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    contributor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    }],
    projectLink: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Projects', projectSchema, '_projects');