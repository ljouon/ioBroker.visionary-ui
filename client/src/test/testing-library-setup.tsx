import { ThemeProvider } from '@/app/theme/theme-provider';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// i18n.use(initReactI18next).init({
//   fallbackLng: FALLBACK_LANGUAGE_KEY,
//   interpolation: {
//     escapeValue: false,
//   },
//   resources: {
//     en: {
//       translation,
//     },
//   },
// });

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
