
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all projects (for admins)
// @route   GET /api/projects/all
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        const projects = await Project.getAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: `Error fetching projects: ${error.message}` });
    }
});

// @desc    Get all approved projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.getApproved();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: `Error fetching approved projects: ${error.message}` });
    }
});


// @desc    Get a user's own projects
// @route   GET /api/projects/myprojects
// @access  Private
router.get('/myprojects', protect, async (req, res) => {
    try {
        console.log('Fetching projects for user:', req.user.uid);
        const projects = await Project.findByAuthor(req.user.uid);
        console.log('Found projects:', projects.length);
        res.json(projects);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ message: `Error fetching user projects: ${error.message}` });
    }
});


// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Error fetching project: ${error.message}` });
    }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, repoLink, demoLink, linkedInPostLink } = req.body;

        if (!title || !description || !repoLink) {
            return res.status(400).json({ message: 'Missing required fields: title, description, repoLink' });
        }

        const newProject = {
            title,
            description,
            repoLink,
            demoLink: demoLink || '',
            linkedInPostLink: linkedInPostLink || '',
            authorUid: req.user.uid,
            status: 'pending'
        };

        console.log('Creating project for user:', req.user.uid, 'Title:', title);
        const createdProject = await Project.create(newProject);
        console.log('Project created successfully:', createdProject.id);
        
        res.status(201).json(createdProject);
    } catch (error) {
        console.error('Project creation error:', error);
        res.status(500).json({ message: `Error creating project: ${error.message}` });
    }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only allow project owner or admin to update
        if (project.authorUid !== req.user.uid && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title, description, repoLink, demoLink, linkedInPostLink } = req.body;
        const updatedData = {
            ...project, // Maintain other fields if not provided? Or just update fields. Supabase update only updates specified fields.
            // But here we want to be explicit provided in body
            // Actually, Supabase update matches keys.
        };

        // Let's construct explicit update object
        const updates = {};
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (repoLink) updates.repoLink = repoLink;
        if (demoLink) updates.demoLink = demoLink;
        if (linkedInPostLink) updates.linkedInPostLink = linkedInPostLink;
        // status is not updated here unless admin? The old code kept status.

        // If nothing to update, return existing
        if (Object.keys(updates).length === 0) {
            return res.json(project);
        }

        const updatedProject = await Project.update(req.params.id, updates);
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: `Error updating project: ${error.message}` });
    }
});


// @desc    Update project status (for admins)
// @route   PUT /api/projects/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status, adminFeedback } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatePayload = {
            status,
            adminFeedback: adminFeedback || ''
        };

        const updatedProject = await Project.update(req.params.id, updatePayload);
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: `Error updating project status: ${error.message}` });
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only allow project owner or admin to delete
        if (project.authorUid !== req.user.uid && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Project.delete(req.params.id);
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: `Error deleting project: ${error.message}` });
    }
});


module.exports = router;
