import { createContext, useEffect, useState } from "react";
import { updateCart } from "../js/utils";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartInLocalStorage =
    localStorage.getItem("cart") != undefined
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  const [cart, setCart] = useState(cartInLocalStorage);
  updateCart(cartInLocalStorage);

  useEffect(() => {
    updateCart(cart);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
