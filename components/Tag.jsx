import "../css/Tag.css";

export const DiscountTag = ({ percentDiscount }) => {
  return <p className="tag discount-tag">-{percentDiscount}%</p>;
};

export const OutStockTag = () => {
  return <p className="tag out-stock-tag">Out of stock</p>;
};
