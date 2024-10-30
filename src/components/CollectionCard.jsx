import "../css/CollectionCard.css";

const CollectionCard = ({ title, subtitle, content, imgUrl }) => {
  return (
    <div
      className={`collection-card ${
        imgUrl ? "collection-card-with-image" : "collection-card-no-image"
      }`}
    >
      {imgUrl && (
        <img src={imgUrl} className="collection-card-image" alt={title} />
      )}
      <div className="collection-card-box">
        <h2 className="collection-card-header">{title}</h2>
        {subtitle && <h3 className="collection-card-subheader">{subtitle}</h3>}
        <p className="collection-card-content">{content}</p>
        {imgUrl && (
          <div className="collection-card-button">
            <p>View More</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionCard;
