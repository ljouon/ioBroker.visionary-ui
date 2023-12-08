import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { VuiDataProvider } from './vui-data.context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <VuiDataProvider>
        <App />
    </VuiDataProvider>,
);
