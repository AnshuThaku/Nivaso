import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import { FaFire, FaMountain, FaHome, FaWater, FaSnowflake, FaBed, FaTree } from "react-icons/fa";
import { GiCastle, GiFarmTractor, GiForestCamp, GiBoatFishing } from "react-icons/gi";

const categories = [
    { name: "Trending", icon: <FaFire /> },
    { name: "Rooms", icon: <FaBed /> },
    { name: "Mountains", icon: <FaMountain /> },
    { name: "Castles", icon: <GiCastle /> },
    { name: "Farms", icon: <GiFarmTractor /> },
    { name: "Domes", icon: <FaHome /> },
    { name: "Boats", icon: <GiBoatFishing /> },
    { name: "Iconic cities", icon: <FaTree /> },
    { name: "Camping", icon: <GiForestCamp /> },
    { name: "Amazing pools", icon: <FaWater /> },
    { name: "Arctic", icon: <FaSnowflake /> },
];

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); 
  
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");

  useEffect(() => {
    fetchListings(categoryQuery, searchQuery);
  }, [categoryQuery, searchQuery]);

  const fetchListings = async (category, search) => {
    setLoading(true);
    try {
      let url = "http://localhost:8080/listings";
      const params = new URLSearchParams();
      
      if (search) params.append("search", search);
      if (category && category !== "Trending") params.append("category", category);
      
      if (params.toString()) {
          url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-4">    
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
             </div>
        ) : (
            <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {listings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                ))}
                </div>
                
                {listings.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-xl text-gray-600">No listings found matching your criteria.</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Listings;
