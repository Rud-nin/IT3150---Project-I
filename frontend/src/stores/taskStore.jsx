import { useFetch } from "../libs/useFetch";
import { create } from "zustand";

export const useTaskStore = create((set) => ({
    isLoading: false,
    createTask: async (projectId, name, description, assignedTo) => {
        set({ isLoading: true });
        try {
            return await useFetch(`/tasks`, {
                method: 'POST',
                body: JSON.stringify({ projectId, name, description, assignedTo }),
            });
        } finally {
            set({ isLoading: false });
        }
    },
    updateTask: async (projectId, taskId, name, description, assignedTo) => {
        set({ isLoading: true });
        try {
            return await useFetch(`/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify({ projectId, name, description, assignedTo }),
            });
        } finally {
            set({ isLoading: false });
        }
    },
    deleteTask: async (taskId) => {
        set({ isLoading: true });
        try {
            return await useFetch(`/tasks/${taskId}`, {
                method: 'DELETE',
            });
        } finally {
            set({ isLoading: false });
        }
    },
}))