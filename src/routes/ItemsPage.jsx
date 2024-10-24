import React, { useContext, useEffect, useState } from "react";
import "../css/ItemsPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext.jsx";
import ProductCard from "../components/ProductCard";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const ItemsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [categories, setCategories] = useState("");

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
          throw new Error("Failed to fetch items");
        }
        const data = await res.json();
        const fetchCategories = [];
        data.forEach((d) => {
          fetchCategories.push(d.permalink);
        });
        setCategories(fetchCategories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllCategories();
    fetchItems();
  }, [category]);

  // Sort Function
  useEffect(() => {
    if (items) {
      let sortedItems = [...items];
      if (sortBy === "price:asc") {
        sortedItems = sortedItems.sort(
          (a, b) => a.promotionalPrice - b.promotionalPrice
        );
      } else if (sortBy === "price:desc") {
        sortedItems = sortedItems.sort(
          (a, b) => b.promotionalPrice - a.promotionalPrice
        );
      } else if (sortBy === "ratings:desc") {
        sortedItems = sortedItems.sort((a, b) => b.ratings - a.ratings);
      }

      setItems(sortedItems);
    }
  }, [sortBy]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!items || !categories) {
    return <h1>Item not found</h1>;
  }

  return (
    <div className="itemspage-container">
      {/* <nav className="itemspage-category">
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
      </nav> */}

      <div className="itemspage-content">
        <div className="itemspage-content-header">
          <h1>Men's cloth</h1>
          <FormControl
            className="itemspage-content-sort"
            sx={{ marginLeft: "auto", minWidth: 100 }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              label="Sort By"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
              }}
              autoWidth
            >
              <MenuItem value={"price:asc"}>Price - Low to High</MenuItem>
              <MenuItem value={"price:desc"}>Price - High to Low</MenuItem>
              <MenuItem value={"ratings:desc"}>Best Seller</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="itemspage-content-grid">
          {items.map((item, idx) => {
            return (
              <ProductCard
                key={`${item}-${idx}`}
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

export default ItemsPage;
