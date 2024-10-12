import { useState } from "react";
import "../css/App.css";
import ProductCard from "./ProductCard.jsx";

function App() {
  return (
    <>
      <ProductCard
        id="kb1yxnG2jd3pAEy225M5"
        name="Abstratct Printed Scarf"
        description="Soft fabric, vibrant prints, versatile styling options."
        price={1990}
        promotionalPrice={1790}
        ratings={4.9}
        imageUrls={[
          "https://firebasestorage.googleapis.com/v0/b/wdb-storefront-project-api.appspot.com/o/products%2F6wSgoNAwkxlbEBvCjwEf%2F_images%2FRAAaDHbm4GKnpwaLJkHX-Gemini%20Generated%20(10).jpeg?alt=media&token=d18fcc79-884d-46ab-bd5f-ba966043757b",
        ]}
      />
    </>
  );
}

export default App;
