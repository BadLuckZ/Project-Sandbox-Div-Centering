import "../css/Slider.css";
import { useState } from "react";
import { DiscountTag, OutStockTag } from "./Tag.jsx";

const Slider = ({ id, permalink, price, promotionalPrice, imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleSubImageClick = (index) => {
    setCurrentIndex(index);
  };
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const percentDiscount = Math.round(
    ((price - promotionalPrice) / price) * 100
  );

  return (
    <div className="slider-container">
      <div className="main-image-section">
        <img
          src={imageUrls[currentIndex]}
          className="main-image"
          alt="Main view"
        />
        {/* {isOutStock ? (
          <OutStockTag />
        ) : percentDiscount > 0 ? (
          <DiscountTag percentDiscount={percentDiscount} />
        ) : null} */}
        <button
          className="left-btn"
          onClick={() => {
            handlePrevClick();
            // {
            //   isOutStock ? null : handlePrevClick();
            // }
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          className="right-btn"
          onClick={() => {
            handleNextClick();
            // {
            //   isOutStock ? null : handleNextClick();
            // }
          }}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
      <div className="sub-image-section">
        {imageUrls.map((imageUrl, index) =>
          currentIndex === index ? null : (
            <img
              src={imageUrl}
              className="sub-image"
              key={index}
              alt="Sub view"
              onClick={() => {
                handleSubImageClick(index);
                // {
                //   isOutStock ? null : handleSubImageClick(index);
                // }
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Slider;
