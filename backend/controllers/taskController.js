import Task from "../models/taskModel";
import Project from "../models/projectModel";

export const createTask = async (req, res) => {
    try {
        const { projectId, name, description, assignedTo } = req.body;
        const createdBy = req.userId;

        if(!projectId || !name) return res.status(400).json({ sucess: false, message: 'Project ID and name are required.' });

        const project = await Project.findById(projectId);
        if(!project)
            return res.status(404).json({ sucess: false, message: 'Project not found.' });
        if(!project.participants.includes(createdBy))
            return res.status(403).json({ sucess: false, message: 'You are not authorized to create a task in this project.' });

        const task = await Task.create({ name, description, assignedTo, createdBy });
        project.tasks.push(task._id);
        await project.save();

        await task.populate({
            path: 'assignedTo',
            select: 'username',
        });

        res.status(201).json({ sucess: true, message: 'Task created successfully.', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sucess: false, message: 'Internal server error.' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, description, assignedTo, status } = req.body;

        const project = await Project.findById(taskId);
        if(!project)
            return res.status(404).json({ sucess: false, message: 'Project not found.' });
        if(!project.participants.includes(req.userId))
            return res.status(403).json({ sucess: false, message: 'You are not authorized to update this task.' });

        const newTask = {};
        if(name) newTask.name = name;
        if(description) newTask.description = description;
        if(assignedTo) newTask.assignedTo = assignedTo;
        if(status) {
            if(!['To Do', 'In Progress', 'Done'].includes(status))
                return res.status(400).json({ sucess: false, message: 'Invalid status.' });
            newTask.status = status;
        }

        if(Object.keys(newTask).length === 0)
            return res.status(400).json({ sucess: false, message: 'No fields to update.' });

        const task = await Task.findByIdAndUpdate(taskId, newTask, { new: true });
        if(!task) return res.status(404).json({ sucess: false, message: 'Task not found.' });

        res.status(200).json({ sucess: true, message: 'Task updated successfully.', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sucess: false, message: 'Internal server error.' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const project = await Project.findById(taskId);
        if(!project)
            return res.status(404).json({ sucess: false, message: 'Project not found.' });
        if(!project.participants.includes(req.userId))
            return res.status(403).json({ sucess: false, message: 'You are not authorized to delete this task.' });

        const task = await Task.findByIdAndDelete(taskId);
        if(!task) return res.status(404).json({ sucess: false, message: 'Task not found.' });

        project.tasks = project.tasks.filter(task => task.toString() !== taskId);
        await project.save();

        res.status(200).json({ sucess: true, message: 'Task deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sucess: false, message: 'Internal server error.' });
    }
};