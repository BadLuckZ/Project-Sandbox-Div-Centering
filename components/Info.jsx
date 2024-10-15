import { useState } from "react";
import "../css/Info.css";
import { formatInteger, getAllColors } from "../js/utils.js";
import { Select, MenuItem } from "@mui/material";

const Info = ({
  id,
  name,
  description,
  price,
  promotionalPrice,
  ratings,
  variants,
}) => {
  const [amount, setAmount] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [cartItem, setCartItem] = useState(null);
  const percentDiscount = Math.round(
    ((price - promotionalPrice) / price) * 100
  );
  const formattedPrice = formatInteger(price, 2);
  const formattedPromotionalPrice = formatInteger(promotionalPrice, 2);

  const allSizes = ["XS", "S", "M", "L", "XL", "2XL"];
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
              From
              {<p>THB {formattedPrice}</p>}
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
          <p>Color</p>
          <div>
            {allColors.map((currentColor, idx) => {
              return (
                <div
                  key={`${id} + ${currentColor} + ${idx}`}
                  className={`info-color-btn ${
                    color === currentColor ? "selected" : ""
                  }`}
                  onClick={() => {
                    setColor(currentColor);
                  }}
                >
                  <div
                    className="info-color-area"
                    style={{ backgroundColor: currentColor }}
                  ></div>
                  <p className="info-color-text">{currentColor}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="info-size">
          <p>Size</p>
          <div>
            {allSizes.map((currentSize, idx) => {
              return (
                <button
                  key={`${id} + ${currentSize} + ${idx}`}
                  value={currentSize}
                  className={`info-size-btn ${
                    size === currentSize ? "selected" : ""
                  }`}
                  onClick={() => setSize(currentSize)}
                >
                  <p>{currentSize}</p>
                </button>
              );
            })}
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
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </div>
        <div
          className="add-to-cart-btn"
          onClick={() => {
            if (color && size) {
              const item = {
                color: color,
                size: size,
                amount: amount,
              };
              setCartItem(item);
              console.log(item);
            } else {
              console.log("Error!");
            }
          }}
        >
          <p>Add to cart</p>
        </div>
      </div>
    </div>
  );
};

export default Info;
