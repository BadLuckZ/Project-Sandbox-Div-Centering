import "../css/Rating.css";

const num_stars = 5;

const Rating = ({ ratings }) => {
  return (
    <div className="rating">
      {Array.from({ length: num_stars }, (v, i) => {
        const starRating = i + 1;
        if (ratings >= starRating) {
          return <i key={i} className="fa-solid fa-star star-full"></i>;
        } else if (Math.ceil(ratings) == starRating) {
          return (
            <i key={i} className="star-half">
              <i className="fa-solid fa-star-half"></i>
              <i className="fa-solid fa-star-half"></i>
            </i>
          );
        } else {
          return <i key={i} className="fa-solid fa-star star-none"></i>;
        }
      })}
    </div>
  );
};

export default Rating;
