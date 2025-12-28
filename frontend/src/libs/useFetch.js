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
        }).then(res => res.json());

        if(!respond.success) throw new Error(res.message);

        return respond;
    } catch(err) {
        console.error(err);
        throw err;
    } finally {
        clearTimeout(id);
    }
}
