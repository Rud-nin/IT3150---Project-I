import Task from "../models/taskModel.js";
import Project from "../models/projectModel.js";
import mongoose from "mongoose";

export const createTask = async (req, res) => {
    try {
        const { projectId, name, description, assignedTo } = req.body;
        const createdBy = req.userId;

        if(!projectId || !name) return res.status(400).json({ success: false, message: 'Project ID and name are required.' });

        const project = await Project.findById(projectId);
        if(!project)
            return res.status(404).json({ success: false, message: 'Project not found.' });
        if(!project.participants.includes(createdBy))
            return res.status(403).json({ success: false, message: 'You are not authorized to create a task in this project.' });

        const task = await Task.create({ name, description, assignedTo, createdBy });
        project.tasks.push(task._id);
        await Promise.all([
            task.populate({
                path: 'assignedTo',
                select: 'username',
            }),
            project.save(),
        ]);

        res.status(201).json({ success: true, message: 'Task created successfully.', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, description, assignedTo, status } = req.body;

        if(status !== undefined && !['To Do', 'In Progress', 'Done'].includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        if(assignedTo !== undefined && !mongoose.Types.ObjectId.isValid(assignedTo))
            return res.status(400).json({ success: false, message: 'Invalid assignedTo.' });

        const [task, project] = await Promise.all([
            Task.findById(taskId),
            Project.findOne({ tasks: taskId }),
        ]);

        if(!task)
            return res.status(404).json({ success: false, message: 'Task not found.' });
        if(!project)
            return res.status(404).json({ success: false, message: 'Project not found.' });
        if(!project.participants.includes(req.userId))
            return res.status(403).json({ success: false, message: 'You are not authorized to update this task.' });

        let differ = false;

        if(name !== undefined && name !== task.name) {
            task.name  = name;
            differ = true;
        }
        if(description !== undefined && description !== task.description) {
            task.description = description;
            differ = true;
        }
        if(assignedTo !== undefined && assignedTo !== task.assignedTo?.toString()) {
            task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
            differ = true;
        }
        if(status !== undefined && status !== task.status) {
            task.status = status;
            differ = true;
        }

        if(!differ) return res.status(400).json({ success: false, message: 'No new value to update.' });

        await task.save();
        res.status(200).json({ success: true, message: 'Task updated successfully.', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const [task, project] = await Promise.all([
            Task.findById(taskId),
            Project.findOne({ tasks: taskId }),
        ]);

        if(!task)
            return res.status(404).json({ success: false, message: 'Task not found.' });
        if(!project)
            return res.status(404).json({ success: false, message: 'Project not found.' });
        if(!project.participants.includes(req.userId))
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this task.' });

        project.tasks = project.tasks.filter(task => task.toString() !== taskId);
        await Promise.all([
            project.save(),
            task.deleteOne()
        ]);

        res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};