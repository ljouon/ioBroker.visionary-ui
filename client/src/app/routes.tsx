import {RootLayout} from "@/app/layout/root-layout";
import {Navigate, Outlet, RouteObject} from "react-router-dom";
import {MainAspectPage} from "./smart-home/structure/main-aspect.page";

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
                element: <div>START</div>,
            },
            {
                path: '/:mainAspect/:canonicalPath',
                element: <MainAspectPage/>,
            }
        ],
    },
];