import { createContext, ReactNode, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProps = {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeState = {
    theme: 'system',
    setTheme: (): null => null,
};

export const ThemeContext = createContext<ThemeState>(initialState);

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'theme-mode', ...props }: ThemeProps) {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

    useEffect((): void => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme): void => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
