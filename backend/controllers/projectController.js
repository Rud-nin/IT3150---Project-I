import Notification from "../models/notificationModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

export const createProject = async (req, res) => {
    try {
        const { name } = req.body;
        const createdBy = req.userId;
        const project = await Project.create({ name, participants: [createdBy], createdBy });
        await project.populate({
            path: 'createdBy',
            select: 'username'
        });
        await project.populate({
            path: 'participants',
            select: 'username'
        });
        res.status(201).json({ success: true, message: 'Project created successfully.', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
                $or: [
                    { participants: req.userId },
                    { createdBy: req.userId },
                ]
            })
            .populate({
                path:'tasks',
                select: '-createdBy',
                populate: {
                    path: 'assignedTo',
                    select: 'username',
                },
            })
            .populate({
                path: 'participants',
                select: 'username',
            })
            .populate({
                path: 'createdBy',
                select: 'username',
            })
            .lean();
        res.status(200).json({ success: true, message: 'Projects fetched successfully.', projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId)
            .populate({
                path:'tasks',
                select: '-createdBy',
                populate: {
                    path: 'assignedTo',
                    select: 'username',
                },
            })
            .populate({
                path: 'participants',
                select: 'username',
            })
            .populate({
                path: 'createdBy',
                select: 'username',
            })
            .lean();
        if(!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        res.status(200).json({ success: true, message: 'Project fetched successfully.', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const createdBy = req.userId;

        const project = await Project.findById(projectId);
        if(!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        if(createdBy.toString() !== project.createdBy.toString())
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this project.' });

        const name = project.name;

        await Promise.all([
            Task.deleteMany({ _id: { $in: project.tasks } }),
            Notification.insertMany(project.participants.map(participant => ({
                message: `${name} was deleted`,
                from: createdBy,
                to: participant, 
            }))),
            project.deleteOne(),
        ]);

        res.status(200).json({ success: true, message: 'Project deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const addParticipant = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;

        if(userId === req.userId.toString())
            return res.status(400).json({ success: false, message: 'You cannot add yourself as a participant.' });

        const [project, from] = await Promise.all([
            Project.findById(projectId),
            User.findById(req.userId),
        ]);
        if(!project)
            return res.status(404).json({ success: false, message: 'Project not found.' });
        if(project.createdBy.toString() !== req.userId.toString())
            return res.status(403).json({ success: false, message: 'You are not authorized to add a participant.' });
        if(project.participants.includes(userId))
            return res.status(400).json({ success: false, message: 'User is already a participant.' });

        project.participants.push(userId);
        await Promise.all([
            Notification.create({ message: `${from.username} added you to ${project.name}`, from: req.userId, to: userId }),
            project.save()
        ]);
        res.status(200).json({ success: true, message: 'Participant added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const removeParticipant = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;

        const project = await Project.findById(projectId);
        if(!project)
            return res.status(404).json({ success: false, message: 'Project not found.' });
        if(project.createdBy.toString() !== req.userId.toString())
            return res.status(403).json({ success: false, message: 'You are not authorized to remove a participant.' });
        if(!project.participants.includes(userId))
            return res.status(400).json({ success: false, message: 'User is not a participant.' });
        if(project.createdBy.toString() === userId)
            return res.status(400).json({ success: false, message: 'You cannot remove yourself as a participant.' });

        project.participants = project.participants.filter(participant => participant.toString() !== userId);
        await project.save();
        res.status(200).json({ success: true, message: 'Participant removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};