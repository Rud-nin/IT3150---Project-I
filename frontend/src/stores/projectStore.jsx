import { create } from 'zustand';
import { useFetch } from '../libs/useFetch';

const notFoundMessage = 'Project not found.';

export const useProjectStore = create((set, get) => ({
    isLoading: false,
    projects: [],
    fetchProjects: async () => {
        set({ isLoading: true });
        try {
            const res = await useFetch('/projects', { method: 'GET' });
            set({ projects: res.projects });
            return res;
        } finally {
            set({ isLoading: false });
        }
    },
    fetchProject: async (id) => {
        set({ isLoading: true });
        try {
            const res = await useFetch(`/projects/${id}`, { method: 'GET' });
            set((state) => ({ projects: state.projects.map(
                project => project._id === id ? res.project : project
            )}));
            return res;
        } catch (error) {
            if (error.message === notFoundMessage)
                get().handleProjectNotFound(id);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    createProject: async (name) => {
        if(!name) throw new Error('Name is required');
        set({ isLoading: true });
        try {
            return await useFetch('/projects', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
        } finally {
            set({ isLoading: false });
        }
    },
    deleteProject: async (id) => {
        set({ isLoading: true });
        try {
            const res = await useFetch(`/projects/${id}`, {
                method: 'DELETE',
            });
            get().handleProjectNotFound(id);
            return res;
        } catch (error) {
            if (error.message === notFoundMessage)
                get().handleProjectNotFound(id);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    addToProject: async (projectById, userId) => {
        set({ isLoading: true });
        try {
            if(!projectById || !userId)
                throw new Error('Project id and user id are required');
            return await useFetch(`/projects/${projectById}/participants`, {
                method: 'POST',
                body: JSON.stringify({ userId }),
            })
        } catch (error) {
            if (error.message === notFoundMessage)
                get().handleProjectNotFound(id);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    removeParticipant: async (projectById, userId) => {
        set({ isLoading: true });
        try {
            if(!projectById || !userId)
                throw new Error('Project id and user id are required');
            return await useFetch(`/projects/${projectById}/participants`, {
                method: 'DELETE',
                body: JSON.stringify({ userId }),
            })
        } catch (error) {
            if (error.message === notFoundMessage)
                get().handleProjectNotFound(id);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    handleProjectNotFound: (id) => set((state) => ({
        projects: state.projects.filter(project => project._id !== id)
    }))
}));