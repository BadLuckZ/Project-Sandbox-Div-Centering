import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../src/routes/HomePage.jsx";
import CartPage from "../src/routes/CartPage.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { CategoryProvider } from "./contexts/CategoryContext.jsx";
import "../src/index.css";
import DetailPage from "./routes/DetailPage.jsx";
import ItemsPage from "./routes/ItemsPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/items/:categoryPermalink",
    element: <ItemsPage />,
  },
  {
    path: "/item/:itemPermalink",
    element: <DetailPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CategoryProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </CategoryProvider>
  </React.StrictMode>
);
