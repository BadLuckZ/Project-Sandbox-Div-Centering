import Footer from "../components/Footer";
import Header from "../components/Header";
import "../css/HomePage.css";

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="homepage-container">
        <h1>This is Home Page</h1>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
