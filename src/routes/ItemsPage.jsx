import React, { useContext, useEffect, useState } from "react";
import "../css/ItemsPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext.jsx";
import ProductCard from "../components/ProductCard";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { categoryData } from "../js/utils.js";

const ItemsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [allItems, setAllItems] = useState({});
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [categories, setCategories] = useState([]);

  const sortOptions = [
    { value: "price:asc", text: "Price - Low to high" },
    { value: "price:desc", text: "Price - High to low" },
    { value: "ratings:desc", text: "Best seller" },
  ];

  // Fetch Data
  useEffect(() => {
    async function fetchAllCategories() {
      setLoading(true);
      try {
        const categoriesRes = await fetch(
          "https://api.storefront.wdb.skooldio.dev/categories"
        );
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesRes.json();
        const fetchedCategories = categoriesData.map((d) => d.permalink);
        setCategories(fetchedCategories);

        const itemsPromises = fetchedCategories.map((cat) =>
          fetch(
            `https://api.storefront.wdb.skooldio.dev/products?categories=${cat}`
          )
            .then((res) => res.json())
            .then((data) => ({ [cat]: data.data }))
        );

        const itemsResults = await Promise.all(itemsPromises);
        const combinedItems = itemsResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setAllItems(combinedItems);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllCategories();
  }, []);

  // Sorting Functions
  useEffect(() => {
    if (allItems[category]) {
      let itemsToDisplay = [...allItems[category]];

      // Apply sorting
      if (sortBy === "price:asc") {
        itemsToDisplay.sort((a, b) => a.promotionalPrice - b.promotionalPrice);
      } else if (sortBy === "price:desc") {
        itemsToDisplay.sort((a, b) => b.promotionalPrice - a.promotionalPrice);
      } else if (sortBy === "ratings:desc") {
        itemsToDisplay.sort((a, b) => b.ratings - a.ratings);
      }

      setDisplayedItems(itemsToDisplay);
    }
  }, [category, sortBy, allItems]);

  const handleClickSortOption = (event) => {
    setSortBy(event.target.value);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!allItems[category] || !categories.length) {
    return <h1>Item not found</h1>;
  }

  return (
    <div className="itemspage-container">
      <div className="itemspage-category">
        {categories.map((c) => (
          <button
            key={c}
            value={c}
            disabled={c === category}
            className={c === category ? "active" : ""}
            onClick={() => {
              navigate(`/items/${c}`);
              setSortBy("");
            }}
          >
            {categoryData[c].text}
          </button>
        ))}
      </div>

      <div className="itemspage-content">
        <div className="itemspage-content-header">
          <h1>{categoryData[category].text}</h1>
          <FormControl sx={{ m: 1, minWidth: 180 }}>
            <Select
              value={sortBy}
              onChange={handleClickSortOption}
              displayEmpty
              renderValue={() => {
                const selectedOption = sortOptions.find(
                  (sortOption) => sortOption.value === sortBy
                );

                return (
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {selectedOption ? selectedOption.text : "Sort by"}
                  </Typography>
                );
              }}
            >
              {sortOptions.map((sortOption) => (
                <MenuItem key={sortOption.value} value={sortOption.value}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor:
                          sortBy === sortOption.value
                            ? "var(--Project-Sandbox-Primary-Red-900)"
                            : "transparent",
                        border:
                          "2px solid var(--Project-Sandbox-Primary-Red-900)",
                      }}
                    />
                    {sortOption.text}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="itemspage-content-grid">
          {displayedItems.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              permalink={item.permalink}
              name={item.name}
              description={item.description}
              price={item.price}
              promotionalPrice={item.promotionalPrice}
              ratings={item.ratings}
              imageUrls={item.imageUrls}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
