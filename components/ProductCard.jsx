import "../css/ProductCard.css";
import { formatInteger } from "../js/utils.js";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  id,
  permalink,
  name,
  description,
  price,
  promotionalPrice,
  ratings,
  imageUrls,
}) => {
  const navigate = useNavigate();

  const percentDiscount = Math.round(
    ((price - promotionalPrice) / price) * 100
  );

  const formattedPrice = formatInteger(price, 0);
  const formattedPromotionalPrice = formatInteger(promotionalPrice, 0);

  return (
    <div
      className="product-card"
      onClick={() => {
        navigate(`/items/${permalink}`);
      }}
    >
      <div className="product-card-image">
        <img src={imageUrls[0]} alt={name} />
        {percentDiscount > 0 && (
          <p className="product-card-discount-tag">-{percentDiscount}%</p>
        )}
      </div>
      <div className="product-card-info">
        <h1 className="product-card-name">{name}</h1>
        <h2 className="product-card-description">{description}</h2>
        <div className="product-card-rating">
          {Array.from({ length: 5 }, (v, i) => {
            const starRating = i + 1;
            if (ratings >= starRating) {
              return (
                <i
                  key={i}
                  className="fa-solid fa-star product-card-star-full"
                ></i>
              );
            } else if (Math.ceil(ratings) === starRating) {
              return (
                <i key={i} className="product-card-star-half">
                  <i className="fa-solid fa-star-half"></i>
                  <i className="fa-solid fa-star-half"></i>
                </i>
              );
            } else {
              return (
                <i
                  key={i}
                  className="fa-solid fa-star product-card-star-none"
                ></i>
              );
            }
          })}
        </div>
        <div className="product-card-price">
          {percentDiscount > 0 ? (
            <>
              <h1 className="product-card-before-price">{formattedPrice}</h1>
              <h1 className="product-card-after-price">
                THB{formattedPromotionalPrice}
              </h1>
            </>
          ) : (
            <h1 className="product-card-normal-price">THB{formattedPrice}</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
