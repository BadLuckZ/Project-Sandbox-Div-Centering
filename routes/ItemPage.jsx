import { useEffect, useState } from "react";
import "../css/ItemPage.css";
import { useParams } from "react-router-dom";
import Slider from "../components/Slider.jsx";
import Info from "../components/Info.jsx";
import ProductCard from "../components/ProductCard.jsx";
import {
  fetchAllItemsInCategories,
  randomlyPickCategory,
  randomlyPickItems,
} from "../js/utils.js";

const ItemPage = () => {
  const { itemPermalink } = useParams();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      setItem(null);
      setRelatedItems(null);
      setLoading(true);
      const url = `https://api.storefront.wdb.skooldio.dev/products/${itemPermalink}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch the item");
        }
        const data = await res.json();
        setItem(data);
        const randomCategory = randomlyPickCategory(data.categories);
        const items = await fetchAllItemsInCategories(randomCategory);
        const randomItems = randomlyPickItems(items.data, 4, data.id);
        setRelatedItems(randomItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemPermalink]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!item) {
    return <h1>Item not found</h1>;
  }

  if (!relatedItems) {
    return <h1>Related Items not found!</h1>;
  }

  return (
    <div className="itempage-container">
      <div className="itempage-content">
        <Slider
          className="itempage-slider"
          id={item.skuCode}
          permalink={item.permalink}
          price={item.price}
          promotionalPrice={item.promotionalPrice}
          imageUrls={item.imageUrls}
        />
        <Info
          className="itempage-info"
          id={item.skuCode}
          permalink={item.permalink}
          name={item.name}
          description={item.description}
          price={item.price}
          promotionalPrice={item.promotionalPrice}
          ratings={item.ratings}
          variants={item.variants}
        />
      </div>
      <div className="itempage-more">
        <h2 className="itempage-more-header">People also like these</h2>
        <div className="itempage-more-content">
          {relatedItems.map((item, idx) => {
            return (
              <ProductCard
                key={itemPermalink + idx}
                id={item.id}
                permalink={item.permalink}
                name={item.name}
                description={item.description}
                price={item.price}
                promotionalPrice={item.promotionalPrice}
                ratings={item.ratings}
                imageUrls={item.imageUrls}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
