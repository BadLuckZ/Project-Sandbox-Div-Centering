import React, { useContext, useEffect, useState } from "react";
import "../css/ItemsPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext.jsx";
import ProductCard from "../components/ProductCard";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";

const ItemsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [categories, setCategories] = useState("");

  const sortOptions = [
    { value: "price:asc", text: "Price - Low to high" },
    { value: "price:desc", text: "Price - High to low" },
    { value: "ratings:desc", text: "Best seller" },
  ];

  // Fetch Items
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const url = `https://api.storefront.wdb.skooldio.dev/products?categories=${category}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await res.json();
        setItems(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAllCategories() {
      setLoading(true);
      const url = `https://api.storefront.wdb.skooldio.dev/categories`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        const fetchCategories = data.map((d) => d.permalink);
        setCategories(fetchCategories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllCategories();
    fetchItems();
    setSortBy("");
  }, [category]);

  // Sort Function
  useEffect(() => {
    if (items) {
      let sortedItems = [...items];
      if (sortBy === "price:asc") {
        sortedItems.sort((a, b) => a.promotionalPrice - b.promotionalPrice);
      } else if (sortBy === "price:desc") {
        sortedItems.sort((a, b) => b.promotionalPrice - a.promotionalPrice);
      } else if (sortBy === "ratings:desc") {
        sortedItems.sort((a, b) => b.ratings - a.ratings);
      }

      setItems(sortedItems);
    }
  }, [sortBy, items]);

  const handleClickSortOption = (event) => {
    setSortBy(event.target.value);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!items || !categories) {
    return <h1>Item not found</h1>;
  }

  return (
    <div className="itemspage-container">
      <div className="itemspage-category">
        {categories.map((category, index) => (
          <button
            key={category}
            value={category}
            className={index === 0 ? "active" : ""}
            onClick={() => {
              navigate(`/items/${category}`);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="itemspage-content">
        <div className="itemspage-content-header">
          <h1>{category}</h1>
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
          {items.map((item) => (
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
