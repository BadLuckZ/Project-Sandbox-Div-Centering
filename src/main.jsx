import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../src/routes/HomePage.jsx";
import ItemPage from "../src/routes/ItemPage.jsx";
import CartPage from "../src/routes/CartPage.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import "../src/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/items/:itemPermalink",
    element: <ItemPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);
