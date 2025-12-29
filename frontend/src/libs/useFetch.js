import { getToken } from "./storage";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';

export async function useFetch(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const respond = await fetch(BASE_URL + '/api' + url, {
            ...options,
            signal: controller.signal,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken() || ''}`,
            },
        });

        const res = await respond.json();

        if(!res.success)
            throw new Error(res.message || 'Something went wrong');

        return res;
    } catch(err) {
        if(import.meta.env.NODE_ENV === 'development')
            console.error(err);
        throw err;
    } finally {
        clearTimeout(id);
    }
}
