import { ThemeProvider } from '@/app/theme/theme-provider';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import '@/app/i18n/i18n';
import i18n from '@/app/i18n/i18n';

i18n.changeLanguage('en');

// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="theme-mode">
            {children}
        </ThemeProvider>
    );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

// override render method
export { customRender as render };
