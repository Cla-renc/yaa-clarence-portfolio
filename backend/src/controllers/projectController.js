const Project = require('../models/Project');

const getProjects = async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
};

const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project) res.json(project);
    else res.status(404).json({ message: 'Project not found' });
};

const createProject = async (req, res) => {
    const project = new Project(req.body);
    const createdProject = await project.save();
    res.status(201).json(createdProject);
};

const updateProject = async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (project) res.json(project);
    else res.status(404).json({ message: 'Project not found' });
};

const deleteProject = async (req, res) => {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (project) res.json({ message: 'Project removed' });
    else res.status(404).json({ message: 'Project not found' });
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
