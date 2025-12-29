import { create } from 'zustand';
import { useFetch } from '../libs/useFetch';
import { removeToken, setToken } from '../libs/storage';

export const useAuthStore = create((set) => ({
    isValidUser: false,
    isLoading: false,
    register: async (username, password) => {
        set({ isLoading: true });
        try {
            if(!username || !password) throw new Error('Username and password are required');
            return await useFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
        } finally {
            set({ isLoading: false });
        }
    },
    login: async (username, password) => {
        set({ isLoading: true });
        try {
            if(!username || !password) throw new Error('Username and password are required');
            const res = await useFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            setToken(res.token);
            set({ isValidUser: true });
            return res;
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        removeToken();
        set({ isValidUser: false });
        await useFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    },
    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const res = await useFetch('/auth/check', { method: 'POST' });
            set({ isValidUser: true });
            return res;
        } catch {
            set({ isValidUser: false });
            return null;
        } finally {
            set({ isLoading: false });
        }
    }
}));