// routes/projectRoute.js

// Imports
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
    getAllProjects,
    getProjectById,
    postNewProject,
    updateProject,
    deleteProject,
    deleteAllProjects
} = require('../controllers/projectController');

// GET All projects
router.get('/getall', verifyToken, getAllProjects);

// GET Project by ID
router.get('/:id', verifyToken, getProjectById);

// POST New project
router.post('/add', verifyToken, postNewProject);

// PATCH Existing project
router.patch('/update/:id', verifyToken, updateProject);

// DELETE Existing project
router.delete('/delete/:id', verifyToken, deleteProject);

// DELETE All existing projects
router.delete('/deleteall', deleteAllProjects);

// Export
module.exports = router;
