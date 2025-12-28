import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import { toggleTheme, isDarkMode } from '../../libs/utils';
import Draggable from '../../components/Draggable/Draggable';
import styles from './Dashboard.module.css';

function Dashboard() {
    const { projects, fetchProjects, fetchProject, createProject, deleteProject } = useProjectStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentProject = projects[currentIndex];
    const [newProject, setNewProject] = useState(null);
    const [deletingProject, setDeletingProject] = useState(null);
    
    const toDoTasks = currentProject?.tasks?.filter(task => task.status === 'To Do') ?? [];
    const inProgressTasks = currentProject?.tasks?.filter(task => task.status === 'In Progress') ?? [];
    const doneTasks = currentProject?.tasks?.filter(task => task.status === 'Done') ?? [];
    
    const [showNotification, setShowNotification] = useState(false);
    const [_, __] = useState(false);

    const { createTask, updateTask, deleteTask } = useTaskStore();
    const [newTask, setNewTask] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);

    const forceRerender = () => __(!_);
    const shiftDown = () => document.getElementById("projects").style.top = "6rem";
    const shiftUp = () => document.getElementById("projects").style.top = "0";

    const handleFetchCurrentProject = async () => {
        if(!currentProject) return;
        await fetchProject(currentProject._id)
            .then(() => toast.success("Project fetched successfully"))
            .catch(() => toast.error("Failed to fetch your current project"));
    };
    
    const handleCreateProject = async () => {
        try {
            await createProject(newProject.name);
            toast.success("Project created successfully");
            shiftUp();
            setNewProject(null);
            await fetchProjects();
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleDeleteProject = async () => {
        try {
            await deleteProject(deletingProject._id);
            toast.success("Project deleted successfully");
            shiftUp();
            setDeletingProject(null);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleCreateTask = async () => {
        if(!currentProject) return toast.error("You must select a project first");
        try {
            await createTask(
                currentProject._id,
                newTask.name,
                newTask.description,
                newTask.assignedTo
            );
            await fetchProject(currentProject._id);
            toast.success("Task created successfully");
            setNewTask(null);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleUpdateTaskStatus = async (task) => {
        if (!currentProject) {
            toast.error("You must select a project first");
            return;
        }

        const taskEl = document.getElementById(task._id);
        const columns = {
            "To Do": document.getElementById("to-do"),
            "In Progress": document.getElementById("in-progress"),
            "Done": document.getElementById("done"),
        };

        if (!taskEl || Object.values(columns).some(el => !el)) return;

        const center = (rect) => ({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });

        const taskCenter = center(taskEl.getBoundingClientRect());

        const distances = Object.entries(columns).map(([status, el]) => {
            const c = center(el.getBoundingClientRect());
            return {
                status,
                dist: Math.hypot(taskCenter.x - c.x, taskCenter.y - c.y),
            };
        });

        const newStatus = distances.sort((a, b) => a.dist - b.dist)[0].status;

        await updateTask(task._id, task.name, task.description, newStatus, task.assignedTo);
        await fetchProject(currentProject._id);
        if(newStatus !== task.status) toast.success(`Task updated to ${newStatus}`);
    };

    const handleUpdateTask = async () => {
        if(!currentTask) return;
        try {
            await updateTask(
                currentTask._id,
                currentTask.name,
                currentTask.description,
                currentTask.status,
                currentTask.assignedTo
            );
            await fetchProject(currentProject._id);
            toast.success("Task updated successfully");
            setCurrentTask(null);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleDeleteTask = async () => {
        if(!currentTask) return;
        try {
            await deleteTask(currentTask._id);
            await fetchProject(currentProject._id);
            toast.success("Task deleted successfully");
            setCurrentTask(null);
            setDeletingTask(null);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if(currentIndex > projects.length - 1) setCurrentIndex(0);
    }, [projects]);

    useEffect(() => {
        fetchProjects()
            .catch(() => toast.error("Failed to fetch your projects"));
    }, [])

    return (
        <div className={styles.dashboard}>
            <nav>
                <button
                    className={styles.style}
                    onClick={() => {
                        shiftDown();
                        setNewProject({ name: "" });
                    }}
                >
                    + Create new project
                </button>
                <div className={styles.divider} />
                {newProject && (
                    <div className={styles.confirm}>
                        <div>
                            <input
                                type="text"
                                placeholder="Project's name"
                                value={newProject.name ?? ""}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}/>
                            <button className={styles.style} onClick={handleCreateProject}>
                                Create
                            </button>
                            <button
                                className={styles.style}
                                onClick={() => {
                                    shiftUp();
                                    setNewProject(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {deletingProject && (
                    <div className={styles.confirm}>
                        <div>
                            <h3>Delete {deletingProject.name}?</h3>
                            <button className={styles.style} onClick={handleDeleteProject}>
                                Delete
                            </button>
                            <button
                                className={styles.style}
                                onClick={() => {
                                    shiftUp();
                                    setDeletingProject(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                <div id="projects" className={styles.projects}>
                    {projects.map((project, index) => (
                        <div key={project._id}>
                            <button onClick={() => setCurrentIndex(index)}>
                                {project.name}
                            </button>
                            <button
                                className={styles.deleteButton}
                                onClick={() => {
                                    shiftDown();
                                    setDeletingProject(project);
                                }}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </nav>
            <section>
                <header>
                    {/* LOADING STATUS */}
                    <button
                        className={styles.style}
                        onClick={() => {toggleTheme(); forceRerender();}}
                    >
                        {isDarkMode() ? (
                            <>
                                <i className="fa-solid fa-sun"></i>
                                <span>Light mode</span>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-moon"></i>
                                <span>Dark mode</span>
                            </>
                        )}
                    </button>
                    <button
                        className={styles.style}
                        onClick={handleFetchCurrentProject}
                    >
                        <i className="fa-solid fa-arrows-rotate"></i>
                        <span>Refresh</span>
                    </button>
                    <button className={styles.style} onClick={() => setNewTask({})}>
                        <i className="fa-brands fa-stack-overflow" />
                        <span>New Task</span>
                    </button>
                    <button className={styles.style}>
                        <i className="fa-solid fa-users" />
                        <span>Invite To Project</span>
                    </button>
                    <button className={styles.style} onClick={() => setShowNotification(n => !n)}>
                        <i className="fa-solid fa-bell" />
                    </button>

                    <div className={styles.dropbox}>
                        {newTask && (
                            <div className={styles.newTask}>
                                <input
                                    type="text"
                                    placeholder="Task's name"
                                    value={newTask.name ?? ""}
                                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}/>
                                <textarea
                                    placeholder="Task's description"
                                    value={newTask.description ?? ""}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                                <select
                                    value={newTask.assignedTo ?? ""}
                                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                                    <option value="">Assign To</option>
                                    {currentProject?.participants.map(participant => (
                                        <option key={participant._id} value={participant._id}>
                                            {participant.username}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className={styles.style}
                                    onClick={handleCreateTask}
                                >
                                    Create
                                </button>
                                <button
                                    className={styles.style}
                                    onClick={() => currentProject ? setNewTask(null) : toast.error("You must select a project first")}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className={styles.divider} />

                <main>
                    <div>
                        <div id='to-do'>To Do</div>
                        {toDoTasks.map(task => (
                            <Draggable
                                key={task._id}
                                onClick={() => setCurrentTask({...task})}
                                onRelease={() => handleUpdateTaskStatus(task)}
                            >
                                <div id={task._id}>
                                    <h3>{task.name}</h3>
                                    <p>{task.description}</p>
                                    {task.assignedTo && <span>Assigned To: {task.assignedTo.username}</span>}
                                </div>
                            </Draggable>
                        ))}
                    </div>
                    <div>
                        <div id='in-progress'>In Progress</div>
                        {inProgressTasks.map(task => (
                            <Draggable
                                key={task._id}
                                onClick={() => setCurrentTask({...task})}
                                onRelease={() => handleUpdateTaskStatus(task)}
                            >
                                <div id={task._id}>
                                    <h3>{task.name}</h3>
                                    <p>{task.description}</p>
                                    {task.assignedTo && <span>Assigned To: {task.assignedTo.username}</span>}
                                </div>
                            </Draggable>
                        ))}
                    </div>
                    <div>
                        <div id='done'>Done</div>
                        {doneTasks.map(task => (
                            <Draggable
                                key={task._id}
                                onClick={() => setCurrentTask({...task})}
                                onRelease={() => handleUpdateTaskStatus(task)}
                            >
                                <div id={task._id}>
                                    <h3>{task.name}</h3>
                                    <p>{task.description}</p>
                                    {task.assignedTo && <span>Assigned To: {task.assignedTo.username}</span>}
                                </div>
                            </Draggable>
                        ))}
                    </div>
                </main>
            </section>

            {currentTask && !deletingTask && (
                <div className={styles.overlay}>
                    <div className={styles.review}>
                        <input
                            type="text"
                            placeholder="Task's name"
                            value={currentTask.name ?? ""}
                            onChange={(e) => setCurrentTask({...currentTask, name: e.target.value})}/>
                        <textarea
                            placeholder="Task's description"
                            value={currentTask.description ?? ""}
                            onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}/>
                        <div><strong>Status: </strong>{currentTask.status}</div>
                        <div>
                            <strong>Assigned To: </strong>
                            <select
                                value={currentTask.assignedTo?._id ?? ""}
                                onChange={(e) => setCurrentTask({
                                    ...currentTask,
                                    assignedTo:{...createTask.assignedTo, _id: e.target.value}
                                })}
                            >
                                <option value="">None</option>
                                {currentProject.participants?.map(participant => (
                                    <option key={participant._id} value={participant._id}>
                                        {participant.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleUpdateTask}>
                            Update
                        </button>
                        <button onClick={() => setDeletingTask(currentTask)}>
                            Delete
                        </button>
                        <button onClick={() => setCurrentTask(null)}>
                            Done
                        </button>
                    </div>
                </div>
            )}

            {deletingTask && (
                <div className={styles.overlay}>
                    <div className={styles.delete}>
                        <h2>Delete {deletingTask.name}?</h2>
                        <button onClick={handleDeleteTask}>
                            Delete
                        </button>
                        <button onClick={() => setDeletingTask(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;