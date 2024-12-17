// controllers/projectController.js

// Imports
import projectModel from '../models/projectModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// Validate contributors and project manager
export const validateContributorsAndManager = async (contributors, projectManager) => {
    try {
        // Check if projectManager ID is valid
        if (!mongoose.Types.ObjectId.isValid(projectManager)) {
            throw new Error(`Invalid project manager ID: ${ projectManager }`);
        }

        // Check if project manager exists
        const managerExists = await User.findById(projectManager);
        if (!managerExists) {
            throw new Error(`Project manager with ID ${ projectManager } does not exist`);
        }

        // Validate each contributor
        const validations = contributors.map(contributorId =>
            User.findById(contributorId).then(userExists => {
                if (!userExists) {
                    throw new Error(`Contributor with ID ${ contributorId } does not exist`);
                }
            })
        );
        // Wait for all validations to complete
        await Promise.all(validations);
    } catch (err) {
        throw new Error(err.message);
    }
};

// GET All projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await projectModel.find({})
            .populate('projectManager', 'firstName lastName')
            .populate('contributor', 'firstName lastName');

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET Project with ID
export const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {

        // Find project by id
        const project = await projectModel.findById(id)
            // Populate projectManager and contributor with first and lastname
            .populate('projectManager', 'firstName lastName')
            .populate('contributor', 'firstName lastName');

        // Check that project exists
        if (!project) {
            return res.status(404).json({ message: "Project with this ID doesn't exist" });
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST New project
export const postNewProject = async (req, res) => {
    try {
        const { projectName, description, projectManager, contributor, projectLink } = req.body;

        // Validate required fields
        if (!projectName || !description || !projectManager || !contributor || !projectLink) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Ensure contributors is an array
        if (!Array.isArray(contributor)) {
            return res.status(400).json({ message: "Contributors should be an array of user IDs" });
        }

        // Validate contributors and project manager
        await validateContributorsAndManager(contributor, projectManager);

        // Create new project
        const newProject = new projectModel({
            projectName,
            description,
            projectManager,
            contributor,
            projectLink,
        });

        // Save new project
        const addedProject = await newProject.save();
        res.status(201).json(addedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE Project
export const updateProject = async (req, res) => {
    try {
        const { projectName, description, projectManager, contributor, projectLink } = req.body;

        // Create updated data
        const updatedData = {
            projectName,
            description,
            projectManager,
            contributor,
            projectLink
        };

        // Find project and update data
        const updatedProject = await projectModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        // Check that project exists
        if (!updatedProject) {
            return res.status(404).json({ message: "Project with this ID doesn't exist" });
        }
        res.status(200).json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE Existing project
export const deleteProject = async (req, res) => {
    try {
        // Find project and delete
        const deletedProject = await projectModel.findByIdAndDelete(req.params.id);

        // Check that project exists
        if (!deletedProject) {
            return res.status(404).json({ message: "Project with this ID doesn't exist" });
        }
        res.status(200).json(deletedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE All existing projects
export const deleteAllProjects = async (req, res) => {
    try {
        // Delete all projects
        const deletedProjects = await projectModel.deleteMany();
        res.status(200).json({ message: `${ deletedProjects.deletedCount } projects deleted` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Exports
export default 'projectController';