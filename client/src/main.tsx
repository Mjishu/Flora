import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from "../routes.jsx";
import './index.css';
import { UserProvider } from './components/user/userContext.js';

//* This is for context I believe
/*const wrappedRoutes = routes.map(route => ({
  ...route,
  element: <UserProvider>{route.element}</UserProvider>
}))*/

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)

