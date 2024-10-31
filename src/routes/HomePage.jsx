import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../css/HomePage.css";
import ProductCard from "../components/ProductCard";
import { getRandomItems } from "../js/utils";
import { Skeleton, useMediaQuery } from "@mui/material";
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
  const isMobile = useMediaQuery("(max-width:425px)");
  const isTablet = useMediaQuery("(min-width:426px) and (max-width:768px)");

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
      <div className="homepage-container">
        <Skeleton variant="rectangular" width="100%" height={420} />

        {/* Collection Section */}
        <div className="homepage-collection">
          <div className="homepage-collection-grid">
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={isMobile ? "100%" : isTablet ? "45%" : "30%"}
                height={430}
              />
            ))}
          </div>
        </div>

        {/* Featured Items Section */}
        <div className="homepage-featured-items">
          <Skeleton variant="text" width={200} height={48} />
          <div className="homepage-featured-items-grid">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={isMobile ? "100%" : isTablet ? "45%" : "22%"}
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
