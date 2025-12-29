import { create } from "zustand";
import { useFetch } from "../libs/useFetch";

export const useUserStore = create((set) => ({
    isLoading: false,
    fetchUsersByName: async (name) => {
        set({ isLoading: true });
        try {
            return await useFetch(`/users?name=${name}`, { method: 'GET' });
        } finally {
            set({ isLoading: false });
        }
    },
}));