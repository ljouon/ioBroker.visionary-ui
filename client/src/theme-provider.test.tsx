import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test/testing-library-setup';
import { ThemeContext, ThemeProvider } from './theme-provider';
import { useContext } from 'react';

// Mock localStorage
const localStorageMock = (function () {
    let store: { [index: string]: string } = {};
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: light)', // set default system theme to light
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    })),
});

describe('ThemeProvider', () => {
    it('initializes theme from localStorage', () => {
        localStorageMock.setItem('theme-mode', 'dark');
        render(
            <ThemeProvider>
                <div />
            </ThemeProvider>,
        );
        const root = document.documentElement;
        expect(root.classList.contains('dark')).toBe(true);
    });

    it('updates localStorage when setTheme is called', () => {
        const { result } = renderHook(() => useContext(ThemeContext), { wrapper: ThemeProvider });
        act(() => {
            result.current.setTheme('dark');
        });
        expect(localStorageMock.getItem('theme-mode')).toBe('dark');
    });

    it('initializes theme with default', () => {
        localStorageMock.clear();
        render(
            <ThemeProvider>
                <div />
            </ThemeProvider>,
        );
        const root = document.documentElement;
        expect(root.classList.contains('light')).toBe(true);
    });
});
