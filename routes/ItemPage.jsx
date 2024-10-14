import { useEffect, useState } from "react";
import "../css/ItemPage.css";
import { useParams } from "react-router-dom";
import Slider from "../components/Slider.jsx";
import Info from "../components/Info.jsx";

const ItemPage = () => {
  const { itemPermalink } = useParams();
  const [item, setItem] = useState(null);
  // useEffect(() => {
  //   async function fetchItem() {
  //     const url =
  //       "https://api.storefront.wdb.skooldio.dev/products/" + itemPermalink;
  //     fetch(url)
  //       .then((res) => {
  //         if (res.ok) {
  //           return res.json();
  //         }
  //         throw Error("Fail to Fetch");
  //       })
  //       .then((data) => {
  //         console.log(data);
  //         setItem(data);
  //       });
  //   }
  //   if (!item) {
  //     fetchItem();
  //   }
  // }, [item]);

  return (
    <div className="itempage-container">
      <Slider
        id="dBt7jOQ9qnKvs8aWrxb5"
        permalink="accessories-abstratct-printed-scarf"
        isOutStock={false}
        price={1990}
        promotionalPrice={1990}
        imageUrls={[
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FtrWAP3Q0eBJTUjhmP683-Gemini%20Generated%20(8).jpeg?alt=media&token=cf7b47de-a656-4608-98a7-96a6b0cc7a2c",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FgoquKCU3fvbDahQPM3Zw-Gemini%20Generated%20Image%20(5).jpeg?alt=media&token=04c0b4fb-e504-4eb5-bc58-b8f9378cf038",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FCDm0y5YKJNIYhEEqqrQ4-Gemini%20Generated%20Image%20(4).jpeg?alt=media&token=ae33d771-6728-410a-8477-076edb15d8eb",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2Fflx7yN8mj5Pc0LumhBzV-Gemini%20(1).jpeg?alt=media&token=c88231a0-346c-46fe-8eb0-52e61f0e15d1",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FWcplN7199exEqvwtmBjv-Gemini%20Generated%20Image%20(6).jpeg?alt=media&token=6f070a53-587a-4c9e-a212-9319074274c7",
        ]}
      />
      <Info
        id="dBt7jOQ9qnKvs8aWrxb5"
        name="Abstratct Printed Scarf"
        description="Soft fabric, vibrant prints, versatile styling options."
        isOutStock={false}
        price={1990}
        promotionalPrice={1990}
        ratings={4.1}
      />
    </div>
  );
};

export default ItemPage;
