const TOKEN = 'token';
export const getToken = () => localStorage.getItem(TOKEN);
export const setToken = (token) => localStorage.setItem(TOKEN, token);
export const removeToken = () => localStorage.removeItem(TOKEN);

const THEME = 'theme';
export const getTheme = () => localStorage.getItem(THEME) ?? 'dark';
export const setTheme = (theme) => localStorage.setItem(THEME, theme);