import React from "react";
import { formatInteger, handleScrollToTop } from "../js/utils";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
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
      className="flex max-w-[267px] w-full h-[425px] flex-col cursor-pointer transition-transform gap-4 duration-300 hover:-translate-y-2 max-[425px]:w-full"
      onClick={() => {
        handleScrollToTop();
        navigate(`/item/${permalink}`);
      }}
    >
      <div className="relative max-w-[267px] h-[267px] max-[425px]:max-w-full">
        <img
          src={imageUrls[0]}
          alt={name}
          className="h-full w-full object-cover object-center"
        />
        {percentDiscount > 0 && (
          <p className="absolute flex right-0 top-[31px] h-[34px] bg-danger text-white px-2.5 py-1 items-center text-base font-normal">
            -{percentDiscount}%
          </p>
        )}
      </div>
      <div className="mt-2 flex flex-col">
        <h1 className="truncate text-2xl font-bold text-secondary-black-900">
          {name}
        </h1>
        <h2 className="truncate text-base font-normal text-secondary-black-700">
          {description}
        </h2>
        <div className="mt-1 flex">
          {Array.from({ length: 5 }, (_, i) => {
            const starRating = i + 1;
            if (ratings >= starRating) {
              return (
                <span
                  key={i}
                  className="inline-block text-2xl text-primary-red-700 w-6 text-center"
                >
                  ★
                </span>
              );
            } else if (Math.ceil(ratings) === starRating) {
              return (
                <span key={i} className="inline-block relative w-6 text-center">
                  <span className="absolute inset-0 text-2xl text-secondary-black-300">
                    ★
                  </span>
                  <span
                    className="absolute inset-0 text-2xl text-primary-red-700 overflow-hidden"
                    style={{
                      clipPath: "inset(0 50% 0 0)",
                    }}
                  >
                    ★
                  </span>
                </span>
              );
            } else {
              return (
                <span
                  key={i}
                  className="inline-block text-2xl text-secondary-black-300 w-6 text-center"
                >
                  ★
                </span>
              );
            }
          })}
        </div>
        <div className="mt-1 flex items-baseline justify-end gap-4">
          {percentDiscount > 0 ? (
            <>
              <span className="text-sm font-semibold text-secondary-black-700 line-through">
                {formattedPrice}
              </span>
              <span className="text-2xl font-bold text-danger">
                THB{formattedPromotionalPrice}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-secondary-black-900">
              THB{formattedPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
