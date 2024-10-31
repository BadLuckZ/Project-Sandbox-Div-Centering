import { useContext, useEffect, useState } from "react";
import "../css/DetailPage.css";
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
  handleScrollToTop,
} from "../js/utils.js";
import { Select, MenuItem, Skeleton } from "@mui/material";
import { CartContext } from "../contexts/CartContext.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { CategoryContext } from "../contexts/CategoryContext.jsx";

const DetailPage = () => {
  const { itemPermalink } = useParams();
  const navigate = useNavigate();
  const { setActiveCategory } = useContext(CategoryContext);
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
    return (
      <div className="detailpage-container">
        <div className="detailpage-content">
          <div className="detailpage-slider-container">
            <Skeleton variant="rectangular" width="100%" height={400} />
            <div className="detailpage-sub-image-section">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={80}
                  height={80}
                />
              ))}
            </div>
          </div>
          <div className="detailpage-info-container">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" width="100%" height={100} />
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="rectangular" width="100%" height={50} />
          </div>
        </div>
        <div className="detailpage-more">
          <Skeleton variant="text" width={200} />
          <div className="detailpage-more-content">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={200}
                height={300}
              />
            ))}
          </div>
        </div>
      </div>
    );
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
    <>
      <Header />
      <div
        className="detailpage-container"
        onClick={() => {
          setActiveCategory(null);
        }}
      >
        {/* Popup Content */}
        {showPopUp && (
          <div className="detailpage-popup-overlay">
            <div className="detailpage-popup-container">
              <div className="detailpage-popup-header">
                <p>Item added to your cart!</p>
                <i
                  className="fa-solid fa-x"
                  onClick={() => {
                    setShowPopUp(false);
                  }}
                ></i>
              </div>
              <div className="detailpage-popup-content">
                <img src={currentItem.imageUrls[0]}></img>
                <div className="detailpage-popup-info">
                  <div>
                    <h3 className="detailpage-popup-name">
                      {currentItem.name}
                    </h3>
                    <div>
                      {color ? (
                        <p className="detailpage-popup-color">
                          Color : {color}
                        </p>
                      ) : null}
                      {size ? (
                        <p className="detailpage-popup-size">Size : {size}</p>
                      ) : null}
                      <p className="detailpage-popup-qty">QTY : {quantity}</p>
                    </div>
                  </div>
                  <h3 className="detailpage-popup-price">
                    THB {formattedPromotionalPrice}
                  </h3>
                </div>
              </div>
              <div className="detailpage-popup-buttons">
                <button
                  className="detailpage-popup-viewcart-btn"
                  onClick={() => {
                    setShowPopUp(false);
                    handleScrollToTop();
                    navigate("/cart");
                  }}
                >
                  View cart
                </button>
                <button
                  className="detailpage-popup-continue-btn"
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

        <div className="detailpage-content">
          {/* Slider Content */}
          <div className="detailpage-slider-container">
            <div className="detailpage-main-image-section">
              <img
                src={currentItem.imageUrls[currentImageIndex]}
                className={`detailpage-main-image ${
                  (!allColors.length || color) && (!allSizes.length || size)
                    ? haveStock
                      ? ""
                      : " disabled"
                    : ""
                }`}
              />
              <button
                className={`detailpage-left-btn ${
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
                className={`detailpage-right-btn ${
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
                    <p className="detailpage-slider-discount-tag">
                      -{percentDiscount}%
                    </p>
                  )
                ) : (
                  <p className="detailpage-slider-outstock-tag">Out of stock</p>
                )
              ) : (
                percentDiscount > 0 && (
                  <p className="detailpage-slider-discount-tag">
                    -{percentDiscount}%
                  </p>
                )
              )}
            </div>
            <div className="detailpage-sub-image-section">
              {currentItem.imageUrls.map((imageUrl, index) =>
                currentImageIndex === index ? null : (
                  <img
                    src={imageUrl}
                    className={`detailpage-sub-image ${
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
                        !haveStock
                      ) {
                      } else {
                        handleSubImageClick(index);
                      }
                    }}
                  />
                )
              )}
            </div>
          </div>

          {/* Info Content */}
          <div className="detailpage-info-container">
            <div className="detailpage-info-info">
              <div className="detailpage-info-info-data">
                <div>
                  <h2 className="detailpage-info-id">
                    ID: {currentItem.skuCode}
                  </h2>
                  <i
                    className="detailpage-info-favorite fa-regular fa-heart"
                    onClick={(event) => {
                      event.target.classList.toggle("fa-regular");
                      event.target.classList.toggle("fa-solid");
                    }}
                  ></i>
                </div>
                <h1 className="detailpage-info-name">{currentItem.name}</h1>
                <h2 className="detailpage-info-description">
                  {currentItem.description}
                </h2>
              </div>
              {percentDiscount ? (
                <div className="detailpage-info-discount">
                  <h1 className="detailpage-info-after-price">
                    THB {formattedPromotionalPrice}
                  </h1>
                  <h3 className="detailpage-info-before-price">
                    From <p>THB {formattedPrice}</p>
                  </h3>
                  {(!allColors.length || color) &&
                  (!allSizes.length || size) ? (
                    haveStock ? null : (
                      <p className="detailpage-info-outstock-tag">
                        Out of stock
                      </p>
                    )
                  ) : null}
                </div>
              ) : (
                <h1 className="detailpage-info-normal-price">
                  THB {formattedPrice}
                </h1>
              )}
              <div className="detailpage-info-rating">
                {Array.from({ length: 5 }, (v, i) => {
                  const starRating = i + 1;
                  if (currentItem.ratings >= starRating) {
                    return (
                      <i
                        key={i}
                        className="fa-solid fa-star detailpage-info-star-full"
                      ></i>
                    );
                  } else if (Math.ceil(currentItem.ratings) === starRating) {
                    return (
                      <i key={i} className="detailpage-info-star-half">
                        <i className="fa-solid fa-star-half"></i>
                        <i className="fa-solid fa-star-half"></i>
                      </i>
                    );
                  } else {
                    return (
                      <i
                        key={i}
                        className="fa-solid fa-star detailpage-info-star-none"
                      ></i>
                    );
                  }
                })}
              </div>
            </div>
            <div className="detailpage-info-option">
              <div
                className="detailpage-info-color"
                style={{ display: allColors.length > 0 ? "flex" : "none" }}
              >
                <p>Color</p>
                <div>
                  {allColors.map((currentColor, idx) => (
                    <div
                      key={`${currentItem.id}-${currentColor}-${idx}`}
                      className={`detailpage-info-color-btn ${
                        color === currentColor ? "selected" : ""
                      }`}
                      onClick={() => {
                        setColor(currentColor);
                        setQuantity("");
                      }}
                    >
                      <div
                        className="detailpage-info-color-area"
                        style={{ backgroundColor: currentColor }}
                      ></div>
                      <p className="detailpage-info-color-text">
                        {currentColor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="detailpage-info-size"
                style={{ display: allSizes.length > 0 ? "flex" : "none" }}
              >
                <p>Size</p>
                <div>
                  {allSizes.map((currentSize, idx) => (
                    <button
                      key={`${currentItem.id}-${currentSize}-${idx}`}
                      className={`detailpage-info-size-btn ${
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
              <div className="detailpage-info-qty">
                <p>Qty.</p>
                <Select
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                  }}
                  disabled={
                    !(
                      (!allColors.length || color) &&
                      (!allSizes.length || size)
                    )
                  }
                  displayEmpty
                >
                  <MenuItem value="">
                    {(!allColors.length || color) && (!allSizes.length || size)
                      ? haveStock
                        ? "Select Quantity"
                        : "Out of Stock"
                      : ""}
                  </MenuItem>
                  {getAvailableQuantities().map((qty) => (
                    <MenuItem key={`qty-${qty}`} value={qty}>
                      {qty}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div
                className={`detailpage-add-to-cart-btn ${
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

        <div className="detailpage-more">
          <h2 className="detailpage-more-header">People also like these</h2>
          <div className="detailpage-more-content">
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
      <Footer />
    </>
  );
};

export default DetailPage;
