import { create } from 'zustand';
import { useFetch } from '../libs/useFetch';
import { removeToken, setToken } from '../libs/storage';

export const useAuthStore = create((set) => ({
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
            return res;
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        set({ token: null });
        removeToken();
        await useFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    },
}));