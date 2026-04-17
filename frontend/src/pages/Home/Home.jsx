import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Components
import HeroSection from "./HeroSection"; 
import TrendingDestinations from "./TrendingDestinations";
import ValueProps from "./ValueProps";
import HostBanner from "./HostBanner";
import Testimonials from "./Testimonials";
import Newsletter from "./Newsletter";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: Vacation vs Rental
  const [listingMode, setListingMode] = useState("stays"); 
  
  // Category State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

  const categories = [
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'beaches', name: 'Beaches', icon: '🏖️' },
    { id: 'mountains', name: 'Mountains', icon: '⛰️' },
    { id: 'cities', name: 'Cities', icon: '🏙️' },
    { id: 'countryside', name: 'Countryside', icon: '🌾' },
    { id: 'pools', name: 'Pools', icon: '🏊' },
    { id: 'lakefront', name: 'Lakefront', icon: '🌊' },
    { id: 'camping', name: 'Camping', icon: '⛺' },
  ];

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      navigate("/listings");
    } else {
      setSelectedCategory(category);
      navigate(`/listings?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Full Screen Video */}
      <HeroSection listingMode={listingMode} setListingMode={setListingMode} />

      


      {/* Main Content Sections */}
      <TrendingDestinations />
      <ValueProps />
      <HostBanner />
      <Testimonials />
      <Newsletter/>

    </div>
  );
};

export default Home;