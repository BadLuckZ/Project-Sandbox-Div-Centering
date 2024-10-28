import { useContext } from "react";
import "../css/CartPage.css";
import { CartContext } from "../contexts/CartContext";
import Header from "../components/Header";

const CartPage = () => {
  const { cart } = useContext(CartContext);
  return (
    <>
      <Header />
      <div className="cartpage-container">
        <h1>This is Cart Page</h1>
        <div>
          {cart.map((cartItem, idx) => {
            return (
              <>
                <div key={`${cartItem.skuCode} ${idx}`}>
                  <p>{cartItem.skuCode || "null"}</p>
                  <p>{cartItem.color || "null"}</p>
                  <p>{cartItem.size || "null"}</p>
                  <p>{cartItem.quantity || "null"}</p>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CartPage;
