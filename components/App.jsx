import { useState } from "react";
import "../css/App.css";
import ProductCard from "./ProductCard.jsx";
import Slider from "./Slider.jsx";

function App() {
  return (
    <>
      <Slider
        imageUrls={[
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FtrWAP3Q0eBJTUjhmP683-Gemini%20Generated%20(8).jpeg?alt=media&token=cf7b47de-a656-4608-98a7-96a6b0cc7a2c",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FgoquKCU3fvbDahQPM3Zw-Gemini%20Generated%20Image%20(5).jpeg?alt=media&token=04c0b4fb-e504-4eb5-bc58-b8f9378cf038",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FCDm0y5YKJNIYhEEqqrQ4-Gemini%20Generated%20Image%20(4).jpeg?alt=media&token=ae33d771-6728-410a-8477-076edb15d8eb",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2Fflx7yN8mj5Pc0LumhBzV-Gemini%20(1).jpeg?alt=media&token=c88231a0-346c-46fe-8eb0-52e61f0e15d1",
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2FdBt7jOQ9qnKvs8aWrxb5%2F_images%2FWcplN7199exEqvwtmBjv-Gemini%20Generated%20Image%20(6).jpeg?alt=media&token=6f070a53-587a-4c9e-a212-9319074274c7",
        ]}
      />
    </>
  );
}

export default App;
