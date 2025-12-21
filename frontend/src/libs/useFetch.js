
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';

export async function useFetch(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        return await fetch(BASE_URL + url, {
            ...options,
            signal: controller.signal,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    } catch(err) {
        console.error(err);
        throw err;
    } finally {
        clearTimeout(id);
    }
}
