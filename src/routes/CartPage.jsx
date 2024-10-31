import { useContext } from "react";
import "../css/CartPage.css";
import { CartContext } from "../contexts/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CategoryContext } from "../contexts/CategoryContext";

const CartPage = () => {
  const { cart } = useContext(CartContext);
  const { setActiveCategory } = useContext(CategoryContext);
  return (
    <>
      <Header />
      <div
        className="cartpage-container"
        onClick={() => {
          setActiveCategory(null);
        }}
      >
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
      <Footer />
    </>
  );
};

export default CartPage;
