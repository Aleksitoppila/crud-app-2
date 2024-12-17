// models/projectModel.js

// Imports
import mongoose from 'mongoose';
import userModel from './userModel.js';

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

export default mongoose.model('Projects', projectSchema, '_projects');