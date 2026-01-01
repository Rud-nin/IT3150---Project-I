import { useFetch } from "../libs/useFetch";
import { create } from "zustand";
import { useProjectStore } from "./projectStore";

const projectNotFoundMessage = 'Project not found.';
const taskNotFoundMessage = 'Task not found.';

export const useTaskStore = create((set) => ({
    isLoading: false,
    createTask: async (projectId, name, description, assignedTo) => {
        set({ isLoading: true });
        try {
            return await useFetch(`/tasks`, {
                method: 'POST',
                body: JSON.stringify({ projectId, name, description, assignedTo }),
            });
        } catch (error) {
            if (error.message === projectNotFoundMessage)
                useProjectStore.getState().handleProjectNotFound(projectId);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    updateTask: async (projectId, taskId, name, description, status, assignedTo) => {
        set({ isLoading: true });
        try {
            return await useFetch(`/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify({ name, description, status, assignedTo }),
            });
        } catch (error) {
            if (error.message === taskNotFoundMessage) {
                useProjectStore.getState().fetchProject(projectId);
            }
            else if ([projectNotFoundMessage, taskNotFoundMessage].includes(error.mess)) {
                useProjectStore.getState().handleProjectNotFound(projectId);
            }
            throw error;
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
        } catch (error) {
            if (error.message === taskNotFoundMessage) {
                useProjectStore.getState().fetchProject(projectId);
            }
            else if (error.message === projectNotFoundMessage) {
                useProjectStore.getState().handleProjectNotFound(projectId);
            }
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}))