import { create } from 'zustand';
import { useFetch } from '../libs/useFetch';

export const useProjectStore = create((set) => ({
    isLoading: false,
    projects: [],
    fetchProjects: async () => {
        set({ isLoading: true });
        try {
            const res = await useFetch('/projects', { method: 'GET' });
            set({ projects: res.projects });
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
            return await useFetch(`/projects/${id}`, {
                method: 'DELETE',
            });
        } finally {
            set({ isLoading: false });
        }
    },
    inviteToProject: async (projectById, userId) => {
        set({ isLoading: true });
        try {
            if(!projectById || !userId)
                throw new Error('Project id and user id are required');
            return await useFetch(`/projects/${projectById}/participants`, {
                method: 'POST',
                body: JSON.stringify({ userId }),
            })
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
        } finally {
            set({ isLoading: false });
        }
    },
}));