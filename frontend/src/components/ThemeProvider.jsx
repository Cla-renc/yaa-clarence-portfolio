import { createContext, useContext, useState, useEffect } from 'react';

const themes = ['theme-default', 'theme-dark-discipline', 'theme-midnight-purpose'];
const defaultTheme = 'theme-default';

const ThemeContext = createContext({
    theme: defaultTheme,
    toggleTheme: () => { }
});

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('yaa_clarence_theme') || defaultTheme;
    });

    useEffect(() => {
        // Remove all theme classes and add the current one directly to body/html
        document.documentElement.classList.remove(...themes);
        if (theme !== 'theme-default') {
            document.documentElement.classList.add(theme);
        }
        localStorage.setItem('yaa_clarence_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
