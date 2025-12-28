import { getTheme, setTheme } from "./storage";

const rootStyles = getComputedStyle(document.documentElement);
const dark = rootStyles.getPropertyValue('--dark');
const light = rootStyles.getPropertyValue('--light');

const setDarkMode = () => {
    document.documentElement.style.setProperty('--bg', dark);
    document.documentElement.style.setProperty('--bg-opposite', light);
    document.documentElement.style.setProperty('--text', light);
    document.documentElement.style.setProperty('--text-opposite', dark);
};

const setLightMode = () => {
    document.documentElement.style.setProperty('--bg', light);
    document.documentElement.style.setProperty('--bg-opposite', dark);
    document.documentElement.style.setProperty('--text', dark);
    document.documentElement.style.setProperty('--text-opposite', light);
};

if(getTheme() === 'dark') {
    setDarkMode();
} else {
    setLightMode();
}

export const isLightMode = () => getTheme() === 'light';
export const isDarkMode = () => getTheme() === 'dark';

export const toggleTheme = () => {
    if(getTheme() === 'dark') {
        setTheme('light');
        setLightMode();
    } else {
        setTheme('dark');
        setDarkMode();
    }
};