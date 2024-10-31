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

const SummaryItem = ({
  hasItemInCart,
  isFinal = false,
  leftValue,
  rightValue,
}) => {
  let formatLeftValue, formatRightValue;
  if (typeof leftValue == typeof 1) {
    formatLeftValue = formatInteger(leftValue, 2);
  } else {
    formatLeftValue = leftValue;
  }
  if (typeof rightValue == typeof 1) {
    formatRightValue = formatInteger(rightValue, 2);
  } else {
    formatRightValue = rightValue;
  }
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
          fontStyle: "normal",
          fontWeight: isFinal ? "600" : "400",
          lineHeight: isFinal ? "24px" : "20px",
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
          fontStyle: "normal",
          fontWeight: isFinal ? "600" : "400",
          lineHeight: isFinal ? "24px" : "20px",
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
      const url = `https://api.storefront.wdb.skooldio.dev/products`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }
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

  const hasItemInCart = totalItemsInCart != 0;

  return (
    <>
      <Header />
      <div
        className="cartpage-container"
        onClick={() => {
          setActiveCategory(null);
        }}
      >
        <div className="cartpage-cart">
          <h1 className="cartpage-header">My Cart</h1>
          <div className="cartpage-content">
            <div className="cartpage-content-items">
              <h2 className="cartpage-content-items-header">Items</h2>
              {hasItemInCart ? (
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
              ) : (
                <p>No Items In Cart</p>
              )}
            </div>
            <div className="cartpage-content-summary">
              <div className="cartpage-content-summary-header">
                <h2>Summary</h2>
                <h3>{`${totalItemsInCart} item${
                  totalItemsInCart == 1 ? "" : "s"
                }`}</h3>
              </div>
              <div className="cartpage-content-summary-items">
                {hasItemInCart ? (
                  cart.map((c) => {
                    return (
                      <SummaryItem
                        hasItemInCart={hasItemInCart}
                        leftValue={`${c.name} ${
                          c.quantity <= 1 ? `` : `x${c.quantity}`
                        }`}
                        rightValue={c.promotionalPrice * c.quantity}
                      />
                    );
                  })
                ) : (
                  <SummaryItem
                    hasItemInCart={hasItemInCart}
                    leftValue={"No Item"}
                    rightValue={0}
                  />
                )}
              </div>
              <hr></hr>
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
              <hr></hr>
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
                        ? "var(--Project-Sandbox-Secondary-Black-300)"
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
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
