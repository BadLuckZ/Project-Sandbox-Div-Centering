const CollectionCard = ({ title, subtitle, content, imgUrl }) => {
  return (
    <div className="relative rounded-lg w-full max-w-[350.5px] min-h-[430px] overflow-hidden">
      {imgUrl ? (
        <>
          <img
            src={imgUrl}
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            alt={title}
          />
          <div className="absolute bottom-0 flex flex-col items-center gap-4 p-4 w-full">
            <h2 className="relative text-white text-center text-2xl font-bold leading-8 z-[2]">
              {title}
            </h2>
            <p className="relative text-white text-center text-base font-normal leading-5 z-[2]">
              {content}
            </p>
            <div className="relative flex h-[54px] px-[10px] py-[7px] justify-center items-center gap-2 bg-secondary-black-900 hover:bg-secondary-black-700 transition-colors duration-300 cursor-pointer z-[2]">
              <p className="text-white text-base font-normal leading-5">
                View More
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <h2 className="text-secondary-black-900 text-[64px] font-bold leading-[92px] z-[2] md:text-[96px] md:leading-[116px]">
            {title}
          </h2>
          {subtitle && (
            <h3 className="text-secondary-black-900 text-[40px] font-bold leading-[60px] mb-6 z-[2] md:text-[48px] md:leading-[72px]">
              {subtitle}
            </h3>
          )}
          <p className="text-secondary-black-900 text-base font-normal leading-5 z-[2]">
            {content}
          </p>
        </div>
      )}
    </div>
  );
};

export default CollectionCard;
