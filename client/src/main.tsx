import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from '@/App';
import { ThemeProvider } from '@/components/theme-provider';
import { VuiDataProvider } from '@/components/data/vui-data.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme="system" storageKey="theme-mode">
        <VuiDataProvider>
            <App />
        </VuiDataProvider>
    </ThemeProvider>,
);
