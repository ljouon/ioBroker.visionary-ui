import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { VuiDataProvider } from './vui-data.context.tsx';
import { ThemeProvider } from '@/theme-provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme="system" storageKey="theme-mode">
        <VuiDataProvider>
            <App />
        </VuiDataProvider>
    </ThemeProvider>,
);
