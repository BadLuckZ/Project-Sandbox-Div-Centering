import React, { useContext, useEffect, useState } from "react";
import "../css/ItemsPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext.jsx";
import ProductCard from "../components/ProductCard";
import {
  FormControl,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { categoryData } from "../js/utils.js";
import SidebarSelector from "../components/SidebarSelector.jsx";
import Header from "../components/Header.jsx";

export default function ItemsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [items, setItems] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [sortedItems, setSortedItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);

  const sortOptions = [
    { value: "price:asc", text: "Price - Low to high" },
    { value: "price:desc", text: "Price - High to low" },
    { value: "ratings:desc", text: "Best seller" },
  ];

  useEffect(() => {
    async function fetchAllCategories() {
      try {
        const url = `https://api.storefront.wdb.skooldio.dev/categories`;
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
  }, []);

  useEffect(() => {
    async function fetchItems() {
      if (category !== currentCategory) {
        setContentLoading(true);
        setItems(null);
        setSortedItems(null);
      }
      try {
        const url = `https://api.storefront.wdb.skooldio.dev/products?categories=${category}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await res.json();
        setItems(data.data);
        setCurrentCategory(category);
      } catch (err) {
        console.error(err);
      } finally {
        setContentLoading(false);
      }
    }
    if (category !== currentCategory) {
      setSortBy("");
      fetchItems();
    }
  }, [category, currentCategory]);

  useEffect(() => {
    if (items) {
      let newSortedItems = [...items];
      if (sortBy === "price:asc") {
        newSortedItems.sort((a, b) => a.promotionalPrice - b.promotionalPrice);
      } else if (sortBy === "price:desc") {
        newSortedItems.sort((a, b) => b.promotionalPrice - a.promotionalPrice);
      } else if (sortBy === "ratings:desc") {
        newSortedItems.sort((a, b) => b.ratings - a.ratings);
      }
      setSortedItems(newSortedItems);
    } else {
      setSortedItems(null);
    }
  }, [sortBy, items]);

  const handleClickSortOption = (event) => {
    setSortBy(event.target.value);
  };

  if (loading || !categories) {
    return (
      <div className="itemspage-container">
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  const currentCategoryData = categoryData.find((cat) => cat.api === category);

  return (
    <>
      <Header />
      <div className="itemspage-container">
        <div className="itemspage-selector">
          <SidebarSelector type="All" current={category} />
          <SidebarSelector type="Shirts" current={category} />
          <SidebarSelector type="Shoes" current={category} />
          <SidebarSelector type="Accessories" current={category} />
        </div>
        <div className="itemspage-content">
          {contentLoading ? (
            <>
              <div className="itemspage-content-header">
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="rectangular" width={180} height={40} />
              </div>
              <div className="itemspage-content-grid">
                {[...Array(8)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={300} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="itemspage-content-header">
                <h1>
                  {currentCategoryData ? currentCategoryData.text : "Category"}
                </h1>
                <FormControl
                  sx={{ m: 1, minWidth: 180 }}
                  className="itemspage-content-sort"
                >
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
                {sortedItems?.map((item) => (
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
