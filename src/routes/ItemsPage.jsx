import React, { useContext, useEffect, useState } from "react";
import "../css/ItemsPage.css";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  FormControl,
  MenuItem,
  Select,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { categoryData } from "../js/utils.js";
import SidebarSelector from "../components/SidebarSelector.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { CategoryContext } from "../contexts/CategoryContext.jsx";

export default function ItemsPage() {
  const { categoryPermalink } = useParams();
  const { setActiveCategory } = useContext(CategoryContext);
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentCategoryPermalink, setCurrentCategoryPermalink] =
    useState(null);
  const [sortedItems, setSortedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(min-width:769px) and (max-width:1024px)");

  const sortOptions = [
    { value: "price:asc", text: "Price - Low to high" },
    { value: "price:desc", text: "Price - High to low" },
    { value: "ratings:desc", text: "Best seller" },
  ];

  useEffect(() => {
    async function fetchItems() {
      if (categoryPermalink !== currentCategoryPermalink) {
        setLoading(true);
        setItems(null);
        setSortedItems(null);
      }
      try {
        const url = `https://api.storefront.wdb.skooldio.dev/products?categories=${categoryPermalink}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await res.json();
        setItems(data.data);
        setCurrentCategoryPermalink(categoryPermalink);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (categoryPermalink !== currentCategoryPermalink) {
      setSortBy("");
      fetchItems();
    }
  }, [categoryPermalink, currentCategoryPermalink]);

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

  const currentCategoryData = categoryData.find(
    (cat) => cat.api === categoryPermalink
  );

  const categoryTypes = [...new Set(categoryData.map((item) => item.type))];

  if (loading || !categoryData) {
    return (
      <div className="itemspage-container">
        {!isMobile && (
          <div className="itemspage-selector">
            <Skeleton variant="rectangular" width={200} height={500} />
          </div>
        )}
        <div className="itemspage-content">
          <div className="itemspage-content-header">
            <Skeleton variant="text" width={"100%"} height={100} />
          </div>
          <div className="itemspage-content-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={"100%"}
                height={425}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header currentPermalink={categoryPermalink} />
      <div
        className="itemspage-container"
        onClick={() => {
          setActiveCategory(null);
        }}
      >
        {!isMobile && (
          <div className="itemspage-selector">
            {categoryTypes.map((categoryType) => (
              <SidebarSelector
                key={categoryType}
                type={categoryType}
                currentPermalink={categoryPermalink}
              />
            ))}
          </div>
        )}
        <div className="itemspage-content">
          <div className="itemspage-content-header">
            <h1>
              {currentCategoryData ? currentCategoryData.text : "Category"}
            </h1>
            <FormControl
              sx={{
                display: "flex",
                height: "54px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
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
                      sx={{
                        color: "var(--Project-Sandbox-Secondary-Black-900)",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "20px",
                      }}
                    >
                      {selectedOption ? selectedOption.text : "Sort by"}
                    </Typography>
                  );
                }}
              >
                {sortOptions.map((sortOption) => (
                  <MenuItem key={sortOption.value} value={sortOption.value}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 6px",
                      }}
                    >
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor:
                            sortBy === sortOption.value
                              ? "var(--Project-Sandbox-Primary-Red-900)"
                              : "transparent",
                          border:
                            "2px solid var(--Project-Sandbox-Primary-Red-900)",
                        }}
                      />
                      <p
                        style={{
                          color: "var(--Project-Sandbox-Secondary-Black-900)",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        {sortOption.text}
                      </p>
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="itemspage-content-grid">
            {sortedItems && sortedItems.length > 0 ? (
              sortedItems.map((item) => (
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
              ))
            ) : (
              <Typography>No items available.</Typography>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
