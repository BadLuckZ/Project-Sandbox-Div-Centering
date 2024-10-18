import { useEffect, useState } from "react";
import "../css/ItemPage.css";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import {
  fetchAllItemsInCategories,
  randomlyPickCategory,
  randomlyPickItems,
  formatInteger,
  getAllSizes,
  getAllColors,
} from "../js/utils.js";
import { Select, MenuItem } from "@mui/material";

const ItemPage = () => {
  const { itemPermalink } = useParams();
  const [currentItem, setCurrentItem] = useState(null); // item from current permalink
  const [relatedItems, setRelatedItems] = useState(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [cartItem, setCartItem] = useState(null); // item that wll be sent to CartPage
  const [haveStock, setHaveStock] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch Item
  useEffect(() => {
    async function fetchItem() {
      setCurrentItem(null);
      setRelatedItems(null);
      setAmount("");
      setSize("");
      setColor("");
      setCartItem(null);
      setHaveStock(false);
      setLoading(true);
      const url = `https://api.storefront.wdb.skooldio.dev/products/${itemPermalink}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch the item");
        }
        const data = await res.json();
        setCurrentItem(data);
        const randomCategory = randomlyPickCategory(data.categories);
        const items = await fetchAllItemsInCategories(randomCategory);
        const randomItems = randomlyPickItems(items.data, 4, data.id);
        setRelatedItems(randomItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemPermalink]);

  // Check whether there is a stock or not
  useEffect(() => {
    if (
      currentItem &&
      ((allColors.length > 0 && color) || (allSizes.length > 0 && size))
    ) {
      const variant = currentItem.variants.find(
        (v) => v.color === color && v.size === size
      );
      if (variant && variant.remains > 0) {
        setHaveStock(true); // Have the target in stock
      } else if (
        (allColors.length > 0 && color) ||
        (allSizes.length > 0 && size)
      ) {
        setHaveStock(false); // Finished selecting but the target is out of stock
      } else {
        setHaveStock(true); // Default
      }
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

  return (
    <div className="itempage-container">
      <div className="itempage-content">
        {/* Slider Content */}
        <div className="slider-container">
          <div className="main-image-section">
            <img
              src={currentItem.imageUrls[currentImageIndex]}
              className="main-image"
              alt="Main view"
            />
            <button
              className="left-btn"
              onClick={() => {
                handlePrevClick();
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              className="right-btn"
              onClick={() => {
                handleNextClick();
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            {(allColors.size > 0 && color) || (allSizes.length > 0 && size) ? (
              haveStock ? (
                percentDiscount > 0 && (
                  <p className="slider-discount-tag">-{percentDiscount}%</p>
                )
              ) : (
                <p className="slider-outstock-tag">Out of stock</p>
              )
            ) : (
              percentDiscount > 0 && (
                <p className="slider-tag slider-discount-tag">
                  -{percentDiscount}%
                </p>
              )
            )}
          </div>
          <div className="sub-image-section">
            {currentItem.imageUrls.map((imageUrl, index) =>
              currentImageIndex === index ? null : (
                <img
                  src={imageUrl}
                  className="sub-image"
                  key={index}
                  alt="Sub view"
                  onClick={() => {
                    handleSubImageClick(index);
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Info Content */}
        <div className="info-container">
          <div className="info-info">
            <div className="info-info-data">
              <h2 className="info-id">ID: {currentItem.id}</h2>
              <h1 className="info-name">{currentItem.name}</h1>
              <h2 className="info-description">{currentItem.description}</h2>
            </div>
            {percentDiscount ? (
              <div className="info-discount">
                <h1 className="info-after-price">
                  THB {formattedPromotionalPrice}
                </h1>
                <h3 className="info-before-price">
                  From <p>THB {formattedPrice}</p>
                </h3>
              </div>
            ) : (
              <h1 className="info-normal-price">THB {formattedPrice}</h1>
            )}
            <div className="info-rating">
              {Array.from({ length: 5 }, (v, i) => {
                const starRating = i + 1;
                if (currentItem.ratings >= starRating) {
                  return (
                    <i key={i} className="fa-solid fa-star info-star-full"></i>
                  );
                } else if (Math.ceil(currentItem.ratings) === starRating) {
                  return (
                    <i key={i} className="info-star-half">
                      <i className="fa-solid fa-star-half"></i>
                      <i className="fa-solid fa-star-half"></i>
                    </i>
                  );
                } else {
                  return (
                    <i key={i} className="fa-solid fa-star info-star-none"></i>
                  );
                }
              })}
            </div>
          </div>
          <div className="info-option">
            <div
              className="info-color"
              style={{ display: allColors.length > 0 ? "flex" : "none" }}
            >
              <p>Color</p>
              <div>
                {allColors.map((currentColor, idx) => (
                  <div
                    key={`${currentItem.id}-${currentColor}-${idx}`}
                    className={`info-color-btn ${
                      color === currentColor ? "selected" : ""
                    }`}
                    onClick={() => {
                      setColor(currentColor);
                      setAmount("");
                      setCartItem(null);
                    }}
                  >
                    <div
                      className="info-color-area"
                      style={{ backgroundColor: currentColor }}
                    ></div>
                    <p className="info-color-text">{currentColor}</p>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="info-size"
              style={{ display: allSizes.length > 0 ? "flex" : "none" }}
            >
              <p>Size</p>
              <div>
                {allSizes.map((currentSize, idx) => (
                  <button
                    key={`${currentItem.id}-${currentSize}-${idx}`}
                    className={`info-size-btn ${
                      size === currentSize ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSize(currentSize);
                      setAmount("");
                      setCartItem(null);
                    }}
                  >
                    <p>{currentSize}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="info-qty">
              <p>Qty.</p>
              <Select
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              >
                {(() => {
                  const variant = currentItem.variants.find(
                    (v) => v.color === color && v.size === size
                  );
                  if (variant && variant.remains > 0) {
                    return Array.from({ length: variant.remains }, (_, i) => (
                      <MenuItem
                        key={`${variant.color}-${variant.size}-${
                          currentItem.id
                        }-${i + 1}`}
                        value={i + 1}
                      >
                        {i + 1}
                      </MenuItem>
                    ));
                  }
                  return (
                    <MenuItem value={""} disabled>
                      Out of Stock
                    </MenuItem>
                  );
                })()}
              </Select>
            </div>
            <div
              className={`add-to-cart-btn ${
                haveStock && amount > 0 ? "" : " disabled"
              }`}
              onClick={() => {
                const item = {
                  id: currentItem.id,
                  permalink: currentItem.permalink,
                  price: currentItem.price,
                  promotionalPrice: currentItem.promotionalPrice,
                  amount: amount,
                  color: color || null,
                  size: size || null,
                };
                setCartItem(item);
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
