import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../../components/Listing/ListingCard";
import { FaFire, FaMountain, FaHome, FaWater, FaSnowflake, FaBed, FaTree } from "react-icons/fa";
import { GiCastle, GiFarmTractor, GiForestCamp, GiBoatFishing } from "react-icons/gi";

// ... aapka categories array waisa hi rahega ...

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Naye States: Infinite Scroll ke liye
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchParams] = useSearchParams(); 
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Agar Filter ya Search change ho, toh Page 1 par wapas aao
  useEffect(() => {
    setListings([]);
    setPage(1);
    setHasMore(true);
  }, [categoryQuery, searchQuery]);

  // 2. Data Fetch Logic
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/listings`;
        const params = new URLSearchParams();
        
        if (searchQuery) params.append("search", searchQuery);
        if (categoryQuery && categoryQuery !== "Trending") params.append("category", categoryQuery);
        params.append("page", page);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await axios.get(url);
        
        // 🔥 MAGIC: Naye cards ko purane cards ke piche jod do
        setListings(prev => {
            if (page === 1) return response.data.listings || response.data;
            return [...prev, ...(response.data.listings || [])];
        });

        // Check karo ki agla page exist karta hai ya nahi
        setHasMore(page < (response.data.totalPages || 1));
        
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [categoryQuery, searchQuery, page]);

  // 🔥 3. THE SENSOR: Aakhri card par sensor lagana
  const observer = useRef();
  const lastListingElementRef = useCallback(node => {
    if (loading) return; 
    if (observer.current) observer.current.disconnect(); 
    
    observer.current = new IntersectionObserver(entries => {
      // Agar user aakhri card tak pahuch gaya aur data baaki hai
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); // Page Number badha do
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="bg-white min-h-screen pt-4">    
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {listings.map((listing, index) => {
            // Agar ye aakhri card hai, toh isme sensor (ref) laga do
            if (listings.length === index + 1) {
              return (
                <div ref={lastListingElementRef} key={listing._id}>
                  <ListingCard listing={listing} />
                </div>
              );
            } else {
              return <ListingCard key={listing._id} listing={listing} />;
            }
          })}
        </div>
        
        {/* Scroll karne par loading spinner */}
        {loading && (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
            </div>
        )}
        
        {/* Agar kuch na mile */}
        {!loading && listings.length === 0 && (
            <div className="text-center py-20">
                <h3 className="text-xl text-gray-600">No listings found.</h3>
            </div>
        )}

      </div>
    </div>
  );
};

export default Listings;