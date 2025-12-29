import { create } from "zustand";
import { useFetch } from "../libs/useFetch";

export const useNotificationStore = create((set) => ({
    isLoading: false,
    notifications: [],
    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const res = await useFetch('/notifications', { method: 'GET' });
            set({ notifications: res.notifications });
            return res;
        } finally {
            set({ isLoading: false });
        }
    },
    deleteNotification: async (id) => {
        set({ isLoading: true });
        try {
            const res = await useFetch(`/notifications/${id}`, {
                method: 'DELETE',
            });
            set((state) => ({ notifications: state.notifications.filter(
                notification => notification._id !== id
            )}));
            return res;
        } finally {
            set({ isLoading: false });
        }
    }
}))