import "../css/ProductCard.css";
import Rating from "./Rating.jsx";

const ProductCard = ({
  id,
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

  const formattedPrice = price.toLocaleString();
  const formattedPromotionalPrice = promotionalPrice.toLocaleString();

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={imageUrls[0]} alt={name} />
        {percentDiscount > 0 && (
          <p className="product-card-discount-tag">-{percentDiscount}%</p>
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
