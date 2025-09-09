import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservar from "./pages/Reservar";
import MisReservas from "./pages/MisReservas";
import AdminPanel from "./pages/AdminPanel";
import { PrivateRoute, RoleRoute } from "./auth/AuthGuard";
import "./styles.css"; // << importa los estilos

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "reservar", element: <PrivateRoute><Reservar /></PrivateRoute> },
      { path: "mis-reservas", element: <PrivateRoute><MisReservas /></PrivateRoute> },
      { path: "admin", element:
          <PrivateRoute><RoleRoute role="ADMIN"><AdminPanel /></RoleRoute></PrivateRoute>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
