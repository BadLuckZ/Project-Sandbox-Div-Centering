import "../css/Info.css";
import { formatInteger } from "../js/utils.js";

const Info = ({
  id,
  name,
  description,
  isOutStock,
  price,
  promotionalPrice,
  ratings,
}) => {
  const percentDiscount = Math.round(
    ((price - promotionalPrice) / price) * 100
  );
  const formattedPrice = formatInteger(price, 2);
  const formattedPromotionalPrice = formatInteger(promotionalPrice, 2);

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
            } else if (Math.ceil(ratings) == starRating) {
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
        <h1>Hello!</h1>
      </div>
    </div>
  );
};

export default Info;
