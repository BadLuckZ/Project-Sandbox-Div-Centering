import { useContext, useState, useEffect } from "react";
import "../css/CartPage.css";
import { CartContext } from "../contexts/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CategoryContext } from "../contexts/CategoryContext";
import {
  formatInteger,
  getAllColors,
  getAllSizes,
  getRandomItems,
} from "../js/utils";
import ProductCard from "../components/ProductCard";
import { Button, MenuItem, Select, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const contentLimit = 4;

const CartPage = () => {
  const { cart, setCart } = useContext(CartContext);
  const [moreItems, setMoreItems] = useState(null);
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setActiveCategory } = useContext(CategoryContext);

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

  const handleRemoveItem = (item) => {
    const newCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(newCart);
  };

  const setNewData = (updatedItem) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === updatedItem.id ? updatedItem : cartItem
    );
    setCart(updatedCart);
  };

  const CartItem = ({ item }) => {
    const {
      id,
      permalink,
      variants,
      currentVariant,
      imageUrls,
      name,
      color,
      size,
      quantity,
      price,
      promotionalPrice,
    } = item;

    console.log(variants);

    const [selectedColor, setSelectedColor] = useState(currentVariant.color);
    const [selectedSize, setSelectedSize] = useState(currentVariant.size);
    const [selectedQuantity, setSelectedQuantity] = useState(quantity);
    const [remains, setRemains] = useState(currentVariant.remains);

    const allSizes = getAllSizes(variants);
    const allColors = getAllColors(variants);

    const handleColorChange = (event) => {
      const updatedColor = event.target.value;
      setSelectedColor(updatedColor);
      const updatedVariant = variants.find(
        (v) => v.color === updatedColor && v.size === selectedSize
      );
      if (updatedVariant && updatedVariant.remains > 0) {
        const updatedItem = {
          ...item,
          color: updatedColor,
          currentVariant: updatedVariant,
          quantity: 1,
        };
        setNewData(updatedItem);
        setRemains(updatedVariant.remains);
      } else {
        handleRemoveItem(item);
      }
    };

    const handleSizeChange = (event) => {
      const updatedSize = event.target.value;
      setSelectedSize(updatedSize);
      const updatedVariant = variants.find(
        (v) => v.size === updatedSize && v.color === selectedColor
      );
      if (updatedVariant && updatedVariant.remains > 0) {
        const updatedItem = {
          ...item,
          size: updatedSize,
          currentVariant: updatedVariant,
          quantity: 1,
        };
        setNewData(updatedItem);
        setRemains(updatedVariant.remains);
      } else {
        handleRemoveItem(item);
      }
    };

    const handleQuantityChange = (event) => {
      const updatedQuantity = event.target.value;
      setSelectedQuantity(updatedQuantity);
      const updatedItem = { ...item, quantity: updatedQuantity };
      setNewData(updatedItem);
    };

    const formattedFinalPrice = formatInteger(price * quantity, 2);
    const formattedFinalPromotionalPrice = formatInteger(
      promotionalPrice * quantity,
      2
    );

    return (
      <>
        <div className="cartpage-content-item">
          <img
            className="cartpage-content-item-image"
            src={imageUrls[0]}
            alt={name}
          />
          <div className="cartpage-content-item-content">
            <div className="cartpage-content-item-header">
              <h3>{name}</h3>
              <i
                className="fa-solid fa-trash"
                onClick={() => {
                  handleRemoveItem(item);
                }}
              ></i>
            </div>
            <div className="cartpage-content-item-detail">
              <div className="cartpage-content-item-selectors">
                {color && (
                  <div className="cartpage-content-item-color">
                    <p>Color</p>
                    <Select
                      value={selectedColor}
                      onChange={handleColorChange}
                      displayEmpty
                    >
                      {allColors.map((colorOption) => (
                        <MenuItem key={colorOption} value={colorOption}>
                          {colorOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                )}
                {size && (
                  <div className="cartpage-content-item-size">
                    <p>Size</p>
                    <Select
                      value={selectedSize}
                      onChange={handleSizeChange}
                      displayEmpty
                    >
                      {allSizes.map((sizeOption) => (
                        <MenuItem key={sizeOption} value={sizeOption}>
                          {sizeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                )}
                <div className="cartpage-content-item-quantity">
                  <p>Qty.</p>
                  <Select
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    displayEmpty
                  >
                    {[...Array(remains).keys()].map((q) => (
                      <MenuItem key={q + 1} value={q + 1}>
                        {q + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="cartpage-content-item-price">
                {price === promotionalPrice ? (
                  <p className="cartpage-content-item-normalprice">
                    THB {formattedFinalPromotionalPrice}
                  </p>
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
        <hr className="cartpage-content-item-endline"></hr>
      </>
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
      typeof rightValue === "number"
        ? formatInteger(rightValue, 2)
        : rightValue;

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
                : "var(--Project-Sandbox-Secondary-Black-900)"
              : "var(--Project-Sandbox-Secondary-Black-700)",
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
                : "var(--Project-Sandbox-Secondary-Black-700)"
              : "var(--Project-Sandbox-Secondary-Black-700)",
            fontSize: isFinal ? "18px" : "16px",
            fontWeight: isFinal ? "600" : "400",
          }}
        >
          {formatRightValue}
        </h3>
      </div>
    );
  };

  if (loading || !moreItems) {
    return (
      <>
        <Skeleton variant="text" height={100} />
        <div className="cartpage-container">
          <div className="cartpage-cart">
            <Skeleton variant="text" width={40} height={40} />
            <div className="cartpage-content">
              <div className="cartpage-content-items">
                <Skeleton variant="text" width={200} height={30} />
                {[...Array(contentLimit)].map((_, idx) => (
                  <Skeleton
                    key={idx}
                    variant="rectangular"
                    height={150}
                    style={{ marginBottom: "20px" }}
                  />
                ))}
              </div>
              <div className="cartpage-content-summary">
                <Skeleton variant="text" width={100} height={30} />
                {[...Array(3)].map((_, idx) => (
                  <Skeleton key={idx} variant="text" width={150} height={20} />
                ))}
                <Skeleton variant="text" width={150} height={40} />
                <div className="cartpage-content-summary-buttons">
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    width={150}
                    style={{ marginBottom: "10px" }}
                  />
                  <Skeleton variant="rectangular" height={40} width={150} />
                </div>
              </div>
            </div>
          </div>
          <Skeleton variant="text" height={100} />
        </div>
      </>
    );
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
                <div className="cartpage-content-empty">
                  <img
                    src="/img/emptycart.svg"
                    className="cartpage-content-empty-background"
                  ></img>
                  <h2 className="cartpage-content-empty-title">
                    Your cart is empty
                  </h2>
                  <h3 className="cartpage-content-empty-subtitle">
                    Looks like you have not added anything to your cart. Go
                    ahead & explore top categories.
                  </h3>
                  <div
                    className="cartpage-content-empty-continue"
                    onClick={() => {
                      navigator(-1);
                    }}
                  >
                    <p>Continue Shopping</p>
                  </div>
                </div>
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
                      leftValue={`${c.name} ${
                        c.quantity <= 1 ? "" : `x${c.quantity}`
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
                  rightValue={0}
                />
              </div>
              <hr />
              <div className="cartpage-content-summary-items">
                <SummaryItem
                  hasItemInCart={hasItemInCart}
                  leftValue={"Total"}
                  isFinal={true}
                  rightValue={0}
                />
              </div>
              <div className="cartpage-content-summary-buttons">
                <Button
                  className="cartpage-content-summary-checkout"
                  disabled={!hasItemInCart}
                  onClick={() => {
                    window.open("https://popdeng.click/", "_blank");
                  }}
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
                  disabled={!hasItemInCart}
                  onClick={() => {
                    navigator(-1);
                  }}
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
