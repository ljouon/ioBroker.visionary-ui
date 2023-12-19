import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from '@/App';
import { VuiDataProvider } from '@/components/aspects/vui-data.context';
import { ThemeProvider } from '@/components/theme/theme-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme="system" storageKey="theme-mode">
        <VuiDataProvider>
            <App />
        </VuiDataProvider>
    </ThemeProvider>,
);
