import { useContext, useState, useEffect } from "react";
import "../css/CartPage.css";
import { CartContext } from "../contexts/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CategoryContext } from "../contexts/CategoryContext";
import { formatInteger, getRandomItems } from "../js/utils";
import ProductCard from "../components/ProductCard";
import { Button } from "@mui/material";

const contentLimit = 4;
const randomFees = [0, 1, 20];

const CartItem = ({ item }) => {
  const {
    id,
    permalink,
    imageUrls,
    name,
    color,
    size,
    quantity,
    price,
    promotionalPrice,
  } = item;

  const formattedFinalPrice = formatInteger(price * quantity, 2);
  const formattedFinalPromotionalPrice = formatInteger(
    promotionalPrice * quantity,
    2
  );

  return (
    <div className="cartpage-content-item">
      <img
        className="cartpage-content-item-image"
        src={imageUrls[0]}
        alt={name}
      />
      <div className="cartpage-content-item-content">
        <div className="cartpage-content-item-header">
          <h3>{name}</h3>
          <i className="fa-solid fa-trash"></i>
        </div>
        <div className="cartpage-content-item-detail">
          <div className="cartpage-content-item-selectors">
            {color && (
              <div className="cartpage-content-item-color">
                <p>Color</p>
                <h3>{color}</h3>
              </div>
            )}
            {size && (
              <div className="cartpage-content-item-size">
                <p>Size</p>
                <h3>{size}</h3>
              </div>
            )}
            <div className="cartpage-content-item-quantity">
              <p>Qty.</p>
              <h3>{quantity}</h3>
            </div>
          </div>
          <div className="cartpage-content-item-price">
            {price === promotionalPrice ? (
              <>
                <p style={{ visibility: "hidden" }}>{formattedFinalPrice}</p>
                <p className="cartpage-content-item-normalprice">
                  THB {formattedFinalPromotionalPrice}
                </p>
              </>
            ) : (
              <>
                <p className="cartpage-content-item-beforeprice">
                  {formattedFinalPrice}
                </p>
                <p className="cartpage-content-item-afterprice">
                  THB {formattedFinalPromotionalPrice}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({
  hasItemInCart,
  isFinal = false,
  leftValue,
  rightValue,
}) => {
  const formatLeftValue =
    typeof leftValue === "number" ? formatInteger(leftValue, 2) : leftValue;
  const formatRightValue =
    typeof rightValue === "number" ? formatInteger(rightValue, 2) : rightValue;

  return (
    <div
      className="cartpage-content-summary-item"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          color: hasItemInCart
            ? isFinal
              ? "var(--Project-Sandbox-Secondary-Black-900)"
              : ""
            : "var(--Project-Sandbox-Secondary-Black-500)",
          fontSize: isFinal ? "18px" : "16px",
          fontWeight: isFinal ? "600" : "400",
        }}
      >
        {formatLeftValue}
      </h2>
      <h3
        style={{
          color: hasItemInCart
            ? isFinal
              ? "var(--Project-Sandbox-Secondary-Black-900)"
              : ""
            : "var(--Project-Sandbox-Secondary-Black-500)",
          fontSize: isFinal ? "18px" : "16px",
          fontWeight: isFinal ? "600" : "400",
        }}
      >
        {formatRightValue}
      </h3>
    </div>
  );
};

const CartPage = () => {
  const { cart } = useContext(CartContext);
  const [moreItems, setMoreItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setActiveCategory } = useContext(CategoryContext);
  const [fee, setFee] = useState(0);

  useEffect(() => {
    let isMounted = false;
    async function fetchMoreItems() {
      setLoading(true);
      const url = "https://api.storefront.wdb.skooldio.dev/products";
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        if (!isMounted) {
          setMoreItems(getRandomItems(data.data, contentLimit));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isMounted) setLoading(false);
      }
    }
    fetchMoreItems();
    return () => {
      isMounted = true;
    };
  }, []);

  useEffect(() => {
    const feeChance = Math.floor(Math.random() * 10);
    if (feeChance < 6) {
      setFee(randomFees[0]);
    } else if (feeChance < 9) {
      setFee(randomFees[1]);
    } else {
      setFee(randomFees[2]);
    }
  }, []);

  if (loading || !moreItems) {
    return <h1>Loading</h1>;
  }

  const totalItemsInCart = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );
  const totalPriceInCart = cart.reduce(
    (price, item) => price + item.quantity * item.promotionalPrice,
    0
  );
  const hasItemInCart = totalItemsInCart !== 0;

  return (
    <>
      <Header />
      <div
        className="cartpage-container"
        onClick={() => setActiveCategory(null)}
      >
        <div className="cartpage-cart">
          <h1 className="cartpage-header">My Cart</h1>
          <div className="cartpage-content">
            <div className="cartpage-content-items">
              <h2 className="cartpage-content-items-header">Items</h2>
              {hasItemInCart ? (
                <div>
                  {cart.map((cartItem) => (
                    <CartItem key={cartItem.id} item={cartItem} />
                  ))}
                </div>
              ) : (
                <p>No Items In Cart</p>
              )}
            </div>
            <div className="cartpage-content-summary">
              <div className="cartpage-content-summary-header">
                <h2>Summary</h2>
                <h3>{`${totalItemsInCart} item${
                  totalItemsInCart === 1 ? "" : "s"
                }`}</h3>
              </div>
              <div className="cartpage-content-summary-items">
                {hasItemInCart ? (
                  cart.map((c) => (
                    <SummaryItem
                      key={c.id}
                      hasItemInCart={hasItemInCart}
                      leftValue={`${c.name}${
                        c.quantity <= 1 ? "" : ` : x${c.quantity}`
                      }`}
                      rightValue={c.promotionalPrice * c.quantity}
                    />
                  ))
                ) : (
                  <SummaryItem
                    hasItemInCart={hasItemInCart}
                    leftValue={"No Item"}
                    rightValue={0}
                  />
                )}
              </div>
              <hr />
              <div className="cartpage-content-summary-items">
                <SummaryItem
                  hasItemInCart={hasItemInCart}
                  leftValue={"Subtotal"}
                  rightValue={totalPriceInCart}
                />
                <SummaryItem
                  hasItemInCart={hasItemInCart}
                  leftValue={"Shipping Fee"}
                  rightValue={hasItemInCart ? fee * totalPriceInCart : 0}
                />
              </div>
              <hr />
              <div className="cartpage-content-summary-items">
                <SummaryItem
                  hasItemInCart={hasItemInCart}
                  leftValue={"Total"}
                  isFinal={true}
                  rightValue={
                    hasItemInCart
                      ? fee * totalPriceInCart + totalPriceInCart
                      : 0
                  }
                />
              </div>
              <div className="cartpage-content-summary-buttons">
                <Button
                  className="cartpage-content-summary-checkout"
                  sx={{
                    background: hasItemInCart
                      ? "var(--Project-Sandbox-Secondary-Black-900)"
                      : "var(--Project-Sandbox-Secondary-Black-300)",
                    cursor: hasItemInCart ? "pointer" : "default",
                    ":hover": {
                      background: hasItemInCart
                        ? "var(--Project-Sandbox-Secondary-Black-700)"
                        : "",
                    },
                  }}
                >
                  <p
                    style={{
                      color: hasItemInCart
                        ? "var(--Project-Sandbox-White)"
                        : "var(--Project-Sandbox-Secondary-Black-500)",
                    }}
                  >
                    Check out
                  </p>
                </Button>
                <Button
                  className="cartpage-content-summary-continue"
                  sx={{
                    border:
                      "1px solid var(--Project-Sandbox-Secondary-Black-300)",
                    background: "var(--Project-Sandbox-White)",
                    cursor: hasItemInCart ? "pointer" : "default",
                    ":hover": {
                      background: hasItemInCart
                        ? "var(--Project-Sandbox-Secondary-Black-100)"
                        : "",
                    },
                  }}
                >
                  <p
                    style={{
                      color: hasItemInCart
                        ? "var(--Project-Sandbox-Secondary-Black-900)"
                        : "var(--Project-Sandbox-Secondary-Black-500)",
                    }}
                  >
                    Continue Shopping
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {!hasItemInCart && (
          <div className="cartpage-more">
            <h2 className="cartpage-more-header">People also like these</h2>
            <div className="cartpage-more-content">
              {moreItems.map((item, idx) => {
                return (
                  <ProductCard
                    key={item + idx}
                    id={item.id}
                    permalink={item.permalink}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    promotionalPrice={item.promotionalPrice}
                    ratings={item.ratings}
                    imageUrls={item.imageUrls}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
