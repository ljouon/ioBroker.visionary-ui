import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CssVarsProvider } from '@mui/joy/styles';
import { VuiDataProvider } from './vui-data.context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <VuiDataProvider>
        <CssVarsProvider />
        <App />
    </VuiDataProvider>,
);
