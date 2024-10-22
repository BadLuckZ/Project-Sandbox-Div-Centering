import { useContext, useEffect, useState } from "react";
import "../css/ItemPage.css";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import {
  fetchAllItemsInCategories,
  randomlyPickCategory,
  randomlyPickItems,
  formatInteger,
  getAllSizes,
  getAllColors,
  getItemInCart,
} from "../js/utils.js";
import { Select, MenuItem } from "@mui/material";
import { CartContext } from "../contexts/CartContext.jsx";

const ItemPage = () => {
  const { itemPermalink } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [currentItem, setCurrentItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [haveStock, setHaveStock] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch Item and Related Items
  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      const url = `https://api.storefront.wdb.skooldio.dev/products/${itemPermalink}`;

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch the item");
        }
        const data = await res.json();
        setCurrentItem(data);

        const itemInCart = getItemInCart(cart, data.id);
        if (itemInCart) {
          setColor(itemInCart.color || "");
          setSize(itemInCart.size || "");
          setQuantity(itemInCart.quantity || "");
        } else {
          setColor("");
          setSize("");
          setQuantity("");
        }

        const randomCategory = randomlyPickCategory(data.categories);
        const items = await fetchAllItemsInCategories(randomCategory);
        const randomItems = randomlyPickItems(items.data, 4, data.id);
        setRelatedItems(randomItems);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemPermalink]);

  // Check Stock Availability
  useEffect(() => {
    if (!currentItem) return;
    const allSizes = getAllSizes(currentItem.variants);
    const allColors = getAllColors(currentItem.variants);

    if ((allColors.length === 0 || color) && (allSizes.length === 0 || size)) {
      const variant = currentItem.variants.find(
        (v) => v.color === color && v.size === size
      );
      setHaveStock(variant && variant.remains > 0);
    } else {
      setHaveStock(true);
    }
  }, [color, size]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!currentItem) {
    return <h1>Item not found</h1>;
  }

  if (!relatedItems) {
    return <h1>Related Items not found!</h1>;
  }

  const handleSubImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? currentItem.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentItem.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const percentDiscount = Math.round(
    ((currentItem.price - currentItem.promotionalPrice) / currentItem.price) *
      100
  );
  const formattedPrice = formatInteger(currentItem.price, 2);
  const formattedPromotionalPrice = formatInteger(
    currentItem.promotionalPrice,
    2
  );

  const allSizes = getAllSizes(currentItem.variants);
  const allColors = getAllColors(currentItem.variants);

  const getAvailableQuantities = () => {
    if (!currentItem || !haveStock) return [];

    const variant = currentItem.variants.find(
      (v) => v.color === color && v.size === size
    );

    if (!variant || variant.remains <= 0) return [];

    return Array.from({ length: variant.remains }, (_, i) => i + 1);
  };

  return (
    <div className="itempage-container">
      {/* Popup Content */}
      {showPopUp && (
        <div className="itempage-popup-overlay">
          <div className="itempage-popup-container">
            <div className="itempage-popup-header">
              <p>Item added to your cart!</p>
              <i
                className="fa-solid fa-x"
                onClick={() => {
                  setShowPopUp(false);
                }}
              ></i>
            </div>
            <div className="itempage-popup-content">
              <img src={currentItem.imageUrls[0]}></img>
              <div className="itempage-popup-info">
                <div>
                  <h3 className="itempage-popup-name">{currentItem.name}</h3>
                  <div>
                    {color ? (
                      <p className="itempage-popup-color">Color : {color}</p>
                    ) : null}
                    {size ? (
                      <p className="itempage-popup-size">Size : {size}</p>
                    ) : null}
                    <p className="itempage-popup-qty">QTY : {quantity}</p>
                  </div>
                </div>
                <h3 className="itempage-popup-price">
                  THB {formattedPromotionalPrice}
                </h3>
              </div>
            </div>
            <div className="itempage-popup-buttons">
              <button
                className="itempage-popup-viewcart-btn"
                onClick={() => {
                  setShowPopUp(false);
                  navigate("/cart");
                }}
              >
                View cart
              </button>
              <button
                className="itempage-popup-continue-btn"
                onClick={() => {
                  setShowPopUp(false);
                }}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="itempage-content">
        {/* Slider Content */}
        <div className="itempage-slider-container">
          <div className="itempage-main-image-section">
            <img
              src={currentItem.imageUrls[currentImageIndex]}
              className={`itempage-main-image ${
                (!allColors.length || color) && (!allSizes.length || size)
                  ? haveStock
                    ? ""
                    : " disabled"
                  : ""
              }`}
            />
            <button
              className={`itempage-left-btn ${
                (!allColors.length || color) && (!allSizes.length || size)
                  ? haveStock
                    ? ""
                    : " disabled"
                  : ""
              }`}
              onClick={handlePrevClick}
              disabled={
                (!allColors.length || color) &&
                (!allSizes.length || size) &&
                !haveStock
              }
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <button
              className={`itempage-right-btn ${
                (!allColors.length || color) && (!allSizes.length || size)
                  ? haveStock
                    ? ""
                    : " disabled"
                  : ""
              }`}
              onClick={handleNextClick}
              disabled={
                (!allColors.length || color) &&
                (!allSizes.length || size) &&
                !haveStock
              }
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            {(!allColors.length || color) && (!allSizes.length || size) ? (
              haveStock ? (
                percentDiscount > 0 && (
                  <p className="itempage-slider-discount-tag">
                    -{percentDiscount}%
                  </p>
                )
              ) : (
                <p className="itempage-slider-outstock-tag">Out of stock</p>
              )
            ) : (
              percentDiscount > 0 && (
                <p className="itempage-slider-discount-tag">
                  -{percentDiscount}%
                </p>
              )
            )}
          </div>
          <div className="itempage-sub-image-section">
            {currentItem.imageUrls.map((imageUrl, index) =>
              currentImageIndex === index ? null : (
                <img
                  src={imageUrl}
                  className={`itempage-sub-image ${
                    (!allColors.length || color) && (!allSizes.length || size)
                      ? haveStock
                        ? ""
                        : " disabled"
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    if (
                      (!allColors.length || color) &&
                      (!allSizes.length || size) &&
                      haveStock
                    ) {
                      handleSubImageClick(index);
                    }
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Info Content */}
        <div className="itempage-info-container">
          <div className="itempage-info-info">
            <div className="itempage-info-info-data">
              <div>
                <h2 className="itempage-info-id">ID: {currentItem.skuCode}</h2>
                <i
                  className="itempage-info-favorite fa-regular fa-heart"
                  onClick={(event) => {
                    event.target.classList.toggle("fa-regular");
                    event.target.classList.toggle("fa-solid");
                  }}
                ></i>
              </div>
              <h1 className="itempage-info-name">{currentItem.name}</h1>
              <h2 className="itempage-info-description">
                {currentItem.description}
              </h2>
            </div>
            {percentDiscount ? (
              <div className="itempage-info-discount">
                <h1 className="itempage-info-after-price">
                  THB {formattedPromotionalPrice}
                </h1>
                <h3 className="itempage-info-before-price">
                  From <p>THB {formattedPrice}</p>
                </h3>
                {(!allColors.length || color) && (!allSizes.length || size) ? (
                  haveStock ? null : (
                    <p className="itempage-info-outstock-tag">Out of stock</p>
                  )
                ) : null}
              </div>
            ) : (
              <h1 className="itempage-info-normal-price">
                THB {formattedPrice}
              </h1>
            )}
            <div className="itempage-info-rating">
              {Array.from({ length: 5 }, (v, i) => {
                const starRating = i + 1;
                if (currentItem.ratings >= starRating) {
                  return (
                    <i
                      key={i}
                      className="fa-solid fa-star itempage-info-star-full"
                    ></i>
                  );
                } else if (Math.ceil(currentItem.ratings) === starRating) {
                  return (
                    <i key={i} className="itempage-info-star-half">
                      <i className="fa-solid fa-star-half"></i>
                      <i className="fa-solid fa-star-half"></i>
                    </i>
                  );
                } else {
                  return (
                    <i
                      key={i}
                      className="fa-solid fa-star itempage-info-star-none"
                    ></i>
                  );
                }
              })}
            </div>
          </div>
          <div className="itempage-info-option">
            <div
              className="itempage-info-color"
              style={{ display: allColors.length > 0 ? "flex" : "none" }}
            >
              <p>Color</p>
              <div>
                {allColors.map((currentColor, idx) => (
                  <div
                    key={`${currentItem.id}-${currentColor}-${idx}`}
                    className={`itempage-info-color-btn ${
                      color === currentColor ? "selected" : ""
                    }`}
                    onClick={() => {
                      setColor(currentColor);
                      setQuantity("");
                    }}
                  >
                    <div
                      className="itempage-info-color-area"
                      style={{ backgroundColor: currentColor }}
                    ></div>
                    <p className="itempage-info-color-text">{currentColor}</p>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="itempage-info-size"
              style={{ display: allSizes.length > 0 ? "flex" : "none" }}
            >
              <p>Size</p>
              <div>
                {allSizes.map((currentSize, idx) => (
                  <button
                    key={`${currentItem.id}-${currentSize}-${idx}`}
                    className={`itempage-info-size-btn ${
                      size === currentSize ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSize(currentSize);
                      setQuantity("");
                    }}
                  >
                    <p>{currentSize}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="itempage-info-qty">
              <p>Qty.</p>
              <Select
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                }}
                displayEmpty
              >
                <MenuItem value="">
                  {haveStock ? "Select Quantity" : "Out of Stock"}
                </MenuItem>
                {getAvailableQuantities().map((qty) => (
                  <MenuItem key={`qty-${qty}`} value={qty}>
                    {qty}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div
              className={`itempage-add-to-cart-btn ${
                haveStock && quantity > 0 ? "" : " disabled"
              }`}
              onClick={() => {
                if (quantity) {
                  const item = {
                    id: currentItem.id,
                    skuCode: currentItem.skuCode,
                    permalink: currentItem.permalink,
                    price: currentItem.price,
                    promotionalPrice: currentItem.promotionalPrice,
                    quantity: quantity,
                    color: color || null,
                    size: size || null,
                  };
                  setCart([
                    ...cart.filter((itemCart) => itemCart.id != item.id),
                    item,
                  ]);
                  setShowPopUp(true);
                }
              }}
            >
              <p>Add to cart</p>
            </div>
          </div>
        </div>
      </div>

      <div className="itempage-more">
        <h2 className="itempage-more-header">People also like these</h2>
        <div className="itempage-more-content">
          {relatedItems.map((item, idx) => {
            return (
              <ProductCard
                key={itemPermalink + idx}
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
  );
};

export default ItemPage;
