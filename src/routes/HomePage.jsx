import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../css/HomePage.css";
import ProductCard from "../components/ProductCard";
import { getRandomItems } from "../js/utils";
import { Skeleton } from "@mui/material";
import CollectionCard from "../components/CollectionCard";
import { CategoryContext } from "../contexts/CategoryContext";

const contentPermalink = "new-arrivals";
const contentLimit = 4;

const collectionCardContent = [
  {
    title: "2024",
    subtitle: "Collection",
    content:
      "Step into a world of winter elegance and style with our latest Winter Collection. As temperatures drop, our curated selection of clothing is designed to keep you fashionably warm. From luxurious knitwear to trend-setting outerwear, each piece in our collection is a celebration of seasonal sophistication. Explore the blend of comfort and fashion, as we present you with the must-have ensembles to make a statement in the chilly months ahead. Welcome to a winter wardrobe that seamlessly combines coziness with chic aesthetics.",
  },
  {
    imgUrl: "https://picsum.photos/900/1200",
    title: "Cozy Breeze",
    content:
      "Embrace the season with our carefully curated selection of garments, each piece thoughtfully designed to blend fashion and functionality. From cozy knits to elegant outerwear, our collection invites you to indulge in the allure of winter fashion. ",
  },
  {
    imgUrl: "https://picsum.photos/400/600",
    title: "Flexi Move",
    content:
      "Step into a world where fashion meets functionality with our latest Sneaker Collection. Designed for those who appreciate the perfect fusion of style and comfort, our curated selection of sneakers is a celebration of urban chic.",
  },
];

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveCategory } = useContext(CategoryContext);
  useEffect(() => {
    let isMounted = false;
    async function fetchFeaturedItems() {
      setLoading(true);
      const url = `https://api.storefront.wdb.skooldio.dev/products?collections=${contentPermalink}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await res.json();
        if (!isMounted) {
          setFeaturedItems(getRandomItems(data.data, contentLimit));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isMounted) setLoading(false);
      }
    }
    fetchFeaturedItems();

    return () => {
      isMounted = true;
    };
  }, []);

  if (loading || !featuredItems) {
    return (
      <>
        <div className="homepage-banner">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{
              borderRadius: 1,
              transform: "none",
            }}
          />
        </div>
        <div className="homepage-container">
          <section className="homepage-collection">
            <Skeleton
              variant="text"
              width={200}
              height={40}
              sx={{ marginBottom: 3 }}
            />
            <div className="homepage-collection-grid">
              {collectionCardContent.map((_, index) => (
                <div key={index} className="homepage-collection-card">
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{
                      borderRadius: 1,
                      transform: "none",
                    }}
                  />
                  <div className="card-content">
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={32}
                      sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}
                    />
                    <Skeleton
                      variant="text"
                      width="100%"
                      height={24}
                      sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={36}
                      sx={{
                        borderRadius: 50,
                        bgcolor: "rgba(255, 255, 255, 0.3)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="homepage-featured-items">
            <Skeleton
              variant="text"
              width={200}
              height={40}
              sx={{ marginBottom: 3 }}
            />
            <div className="homepage-featured-items-grid">
              {Array.from({ length: contentLimit }).map((_, index) => (
                <div key={index} style={{ width: "100%" }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={0}
                    sx={{
                      paddingTop: "133%",
                      borderRadius: 1,
                      transform: "none",
                      marginBottom: 1,
                    }}
                  />
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={24} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        className="homepage-banner"
        onClick={() => {
          setActiveCategory(null);
        }}
      >
        <img src="https://picsum.photos/2000/600" />
      </div>
      <div className="homepage-container">
        <section className="homepage-collection">
          <div className="homepage-collection-grid">
            {collectionCardContent.map((content, idx) => {
              return (
                <CollectionCard
                  key={`${content}-${idx}`}
                  title={content.title}
                  subtitle={content.subtitle}
                  content={content.content}
                  imgUrl={content.imgUrl}
                />
              );
            })}
          </div>
        </section>

        <section className="homepage-featured-items">
          <h2 className="homepage-featured-items-header">Featured Product</h2>
          <div className="homepage-featured-items-grid">
            {featuredItems.map((item) => (
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
        </section>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
