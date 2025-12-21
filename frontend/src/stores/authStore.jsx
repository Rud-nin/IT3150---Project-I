import { create } from 'zustand';
import { useFetch } from '../libs/useFetch';

export const useAuthStore = create((set) => ({
    isLoading: false,
    register: async (username, password) => {
        set({ isLoading: true });
        try {
            if(!username || !password) throw new Error('Username and password are required');
            return await useFetch('/register', {
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
            return await useFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            })
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        set({ isLoading: true });
        try {
            return await useFetch('/logout', {
                method: 'POST',
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));