import {RootLayout} from '@/app/layout/root-layout';
import {Navigate, Outlet, RouteObject} from 'react-router-dom';
import {MainAspectPage} from './smart-home/structure/main-aspect.page';
import {HomePage} from '@/app/smart-home/structure/home.page';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <RootLayout>
                <Outlet/>
            </RootLayout>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/home"/>,
            },
            {
                path: '/home',
                element: <HomePage/>,
            },
            {
                path: '/:mainAspect/:canonicalPath',
                element: <MainAspectPage/>,
            },
        ],
    },
];
