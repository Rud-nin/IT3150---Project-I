import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProjectStore } from '../../stores/projectStore';
import styles from './Dashboard.module.css';

function Dashboard() {
    const { projects, fetchProjects, createProject, deleteProject } = useProjectStore();
    const [currentProject, setCurrentProject] = useState(null);
    const [newProject, setNewProject] = useState(null);
    
    const toDoTasks = currentProject?.tasks?.filter(task => task.status === 'To Do') ?? [];
    const inProgressTasks = currentProject?.tasks?.filter(task => task.status === 'In Progress') ?? [];
    const doneTasks = currentProject?.tasks?.filter(task => task.status === 'Done') ?? [];
    
    const [showNotification, setShowNotification] = useState(false);
    
    const handleSetNewProject = () => {
        document.getElementById("projects").style.top = "6rem";
        setNewProject({ name: "" });
    }
    
    const handleCancelNewProject = () => {
        document.getElementById("projects").style.top = "0";
        setNewProject(null);
    }
    
    const handleCreateProject = async () => {
        try {
            await createProject(newProject.name);
            toast.success("Project created successfully");
            handleCancelNewProject();
            await fetchProjects();
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!currentProject) return;
        let exist = false;
        projects.forEach(project => exist |= project._id === currentProject._id);
        if (!exist) setCurrentProject(null);
    }, [projects]);

    useEffect(() => {
        fetchProjects().catch(() => {});
    }, [])

    return (
        <div className={styles.dashboard}>
            <nav>
                <button className={styles.style} onClick={handleSetNewProject}>
                    + Create new project
                </button>
                <div className={styles.divider} />
                {newProject && (
                    <div className={styles.newProject}>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter project's name"
                                value={newProject.name ?? ""}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}/>
                            <button className={styles.style} onClick={handleCreateProject}>
                                Create
                            </button>
                            <button className={styles.style} onClick={handleCancelNewProject}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                <div id="projects" className={styles.projects}>
                    {projects?.map(project => (
                        <button key={project._id} onClick={() => setCurrentProject(project)}>
                            {project.name}
                        </button>
                    ))}
                </div>
            </nav>
            <section>
                <header>
                    {/* LOADING STATUS */}
                    <button className={styles.style}>
                        <i className="fa-solid fa-sun"></i>
                        <i className="fa-solid fa-moon"></i>
                        <span>Dark Mode</span>
                    </button>
                    <button className={styles.style}>
                        <i className="fa-solid fa-arrows-rotate"></i>
                        <span>Refresh</span>
                    </button>
                    <button className={styles.style}>
                        <i className="fa-brands fa-stack-overflow" />
                        <span>New Task</span>
                    </button>
                    <button className={styles.style}>
                        <i className="fa-solid fa-users" />
                        <span>Invite To Project</span>
                    </button>
                    <button className={styles.style} onClick={() => setShowNotification(n => !n)}>
                        <i className="fa-solid fa-bell" />
                        {/* NOTIFICATION DIV */}
                    </button>
                </header>

                <div className={styles.divider} />

                <main>
                    <div>
                        <div>To Do</div>
                        {toDoTasks.map(task => (
                            <div key={task._id} className={styles.style}>
                                <h3>{task.name}</h3>
                                <p>{task.description}</p>
                                {task.assignedTo && <span>Assigned To: {task.assignedTo.username}</span>}
                            </div>
                        ))}
                        <div className={styles.style}>
                            <h3>Hello world</h3>
                            <p>Description</p>
                            <span>Assigned To: Example username</span>
                        </div>
                    </div>
                    <div>
                        <div>In Progress</div>
                        {inProgressTasks.map(task => (
                            <div key={task._id} className={styles.style}>
                                <h3>{task.name}</h3>
                                <p>{task.description}</p>
                                {task.assignedTo && <span>Assigned To: {task.assignedTo.username}</span>}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div>Done</div>
                        {doneTasks.map(task => (
                            <div key={task._id} className={styles.style}>
                                <h3>{task.name}</h3>
                                <p>{task.description}</p>
                                {task.assignedTo && <span>Assigned To: {task.assignedTo.username}</span>}
                            </div>
                        ))}
                    </div>
                </main>
            </section>
        </div>
    );
}

export default Dashboard;