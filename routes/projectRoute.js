// routes/projectRoute.js

// Imports
import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import {
    getAllProjects,
    getProjectById,
    postNewProject,
    updateProject,
    deleteProject,
    deleteAllProjects
} from '../controllers/projectController.js';

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
export default router;
