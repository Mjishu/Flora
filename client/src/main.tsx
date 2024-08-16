import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from "../routes.jsx";
import './index.css';

//* This is for context I believe
/*const wrappedRoutes = routes.map(route => ({
  ...route,
  element: <UserProvider>{route.element}</UserProvider>
}))*/

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

