import "../css/ProductCard.css";
import Rating from "./Rating.jsx";
import { formatInteger } from "../js/utils.js";
import { DiscountTag } from "./Tag.jsx";

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
  const percentDiscount = Math.round(
    ((price - promotionalPrice) / price) * 100
  );

  const formattedPrice = formatInteger(price, 2);
  const formattedPromotionalPrice = formatInteger(promotionalPrice, 2);

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={imageUrls[0]} alt={name} />
        {percentDiscount > 0 && (
          <DiscountTag percentDiscount={percentDiscount} />
        )}
      </div>
      <div className="product-card-info">
        <h1 className="product-card-name">{name}</h1>
        <h2 className="product-card-description">{description}</h2>
        <Rating ratings={ratings} />
        <div className="product-card-price">
          {percentDiscount > 0 ? (
            <>
              <h1 className="product-card-before-price">THB{formattedPrice}</h1>
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
