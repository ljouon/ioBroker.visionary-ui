import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {routes} from "@/app/routes";

export function App() {


    const router = createBrowserRouter(routes);

    /*{pageContent}*/


    return (
        <RouterProvider router={router}/>
    );
}
