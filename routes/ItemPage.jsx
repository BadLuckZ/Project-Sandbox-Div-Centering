import { useEffect, useState } from "react";
import "../css/ItemPage.css";
import { useParams } from "react-router-dom";
import Slider from "../components/Slider.jsx";
import Info from "../components/Info.jsx";

const ItemPage = () => {
  const { itemPermalink } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const url = `https://api.storefront.wdb.skooldio.dev/products/${itemPermalink}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setItem(data);
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

  return (
    <div className="itempage-container">
      <div className="itempage-content">
        <Slider
          id={item.skuCode}
          permalink={item.permaLink}
          price={item.price}
          promotionalPrice={item.promotionalPrice}
          imageUrls={item.imageUrls}
        />
        <Info
          id={item.skuCode}
          name={item.name}
          description={item.description}
          isOutStock={item.isOutStock}
          price={item.price}
          promotionalPrice={item.promotionalPrice}
          ratings={item.ratings}
          variants={item.variants}
        />
      </div>
    </div>
  );
};

export default ItemPage;
