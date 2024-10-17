import { useState } from "react";
import "../css/Info.css";
import { formatInteger, getAllSizes, getAllColors } from "../js/utils.js";
import { Select, MenuItem } from "@mui/material";

const Info = ({
  id,
  permalink,
  name,
  description,
  price,
  promotionalPrice,
  ratings,
  variants,
}) => {
  const [amount, setAmount] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [cartItem, setCartItem] = useState(null);

  const percentDiscount = Math.round(
    ((price - promotionalPrice) / price) * 100
  );
  const formattedPrice = formatInteger(price, 2);
  const formattedPromotionalPrice = formatInteger(promotionalPrice, 2);

  const allSizes = getAllSizes(variants);
  const allColors = getAllColors(variants);

  return (
    <div className="info-container">
      <div className="info-info">
        <div className="info-info-data">
          <h2 className="info-id">ID: {id}</h2>
          <h1 className="info-name">{name}</h1>
          <h2 className="info-description">{description}</h2>
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
            if (ratings >= starRating) {
              return (
                <i key={i} className="fa-solid fa-star info-star-full"></i>
              );
            } else if (Math.ceil(ratings) === starRating) {
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
        <div className="info-color">
          {allColors.length > 0 && (
            <>
              <p>Color</p>
              <div>
                {allColors.map((currentColor, idx) => (
                  <div
                    key={`${id}-${currentColor}-${idx}`}
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
            </>
          )}
        </div>
        <div className="info-size">
          {allSizes.length > 0 && (
            <>
              <p>Size</p>
              <div>
                {allSizes.map((currentSize, idx) => (
                  <button
                    key={`${id}-${currentSize}-${idx}`}
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
            </>
          )}
        </div>
        <div className="info-qty">
          <p>Qty.</p>
          <Select
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              const item = {
                id: id,
                permalink: permalink,
                price: price,
                promotionalPrice: promotionalPrice,
                amount: event.target.value,
                color: color || null,
                size: size || null,
              };
              setCartItem(item);
            }}
          >
            {(() => {
              const variant = variants.find(
                (v) => v.color === color && v.size === size
              );
              if (variant && variant.remains > 0) {
                return Array.from({ length: variant.remains }, (_, i) => (
                  <MenuItem
                    key={`${variant.color}-${variant.size}-${id}-${i + 1}`}
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
          className={`add-to-cart-btn ${cartItem ? "" : "disabled"}`}
          onClick={() => {
            console.log(cartItem);
          }}
        >
          <p>Add to cart</p>
        </div>
      </div>
    </div>
  );
};

export default Info;
