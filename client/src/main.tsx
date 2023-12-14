import ReactDOM from 'react-dom/client';
import './index.css';
import { VuiDataProvider } from './vui-data.context';
import { ThemeProvider } from '@/theme-provider';
import { App } from '@/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme="system" storageKey="theme-mode">
        <VuiDataProvider>
            <App />
        </VuiDataProvider>
    </ThemeProvider>,
);
