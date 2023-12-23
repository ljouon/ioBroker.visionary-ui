import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/app/routes';
import '@/app/i18n/i18n';

export function App() {
    const router = createBrowserRouter(routes);
    return <RouterProvider router={router} />;
}
