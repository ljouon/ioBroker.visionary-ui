import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from '@/App';
import { ThemeProvider } from '@/app/theme/theme-provider';
import { VuiDataProvider } from './app/smart-home/data.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme="system" storageKey="theme-mode">
        <VuiDataProvider>
            <App />
        </VuiDataProvider>
    </ThemeProvider>,
);
