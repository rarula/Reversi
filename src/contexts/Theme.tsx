import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type ActualTheme = 'light' | 'dark';

type Props = {
    children: ReactNode;
};

type ContextTheme = {
    theme: ActualTheme;
    toggleTheme: () => void;
};

const Theme = createContext<ContextTheme>({
    theme: 'dark',
    toggleTheme: () => {},
});

export const useTheme = (): ContextTheme => {
    return useContext(Theme);
};

const ThemeProvider = ({ children }: Props): JSX.Element => {
    const [theme, setTheme] = useState<ActualTheme>('dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f7f7' : '#1c1c1c');
    }, [theme]);

    const toggleTheme = (): void => {
        setTheme((prev) => prev === 'light' ? 'dark' : 'light');
    };

    const value: ContextTheme = {
        theme,
        toggleTheme,
    };

    return (
        <Theme.Provider value={value}>
            {children}
        </Theme.Provider>
    );
};

export default ThemeProvider;
