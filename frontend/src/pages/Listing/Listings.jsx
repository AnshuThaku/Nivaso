import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../../components/Listing/ListingCard";
import { FaHome } from "react-icons/fa";
import { motion } from 'framer-motion';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Infinite Scroll States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchParams] = useSearchParams(); 
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Reset logic jab filter change ho
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
        
        // Naye cards append karo
        setListings(prev => {
            if (page === 1) return response.data.listings || response.data;
            return [...prev, ...(response.data.listings || [])];
        });

        // Check if more pages exist
        setHasMore(page < (response.data.totalPages || 1));
        
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [categoryQuery, searchQuery, page]);

  // 3. THE SENSOR: Intersection Observer
  const observer = useRef();
  const lastListingElementRef = useCallback(node => {
    if (loading) return; 
    if (observer.current) observer.current.disconnect(); 
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); 
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="bg-white min-h-screen pt-25 pb-16">    
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
     {/* 🔥 Premium Header Section */}
<motion.div 
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mb-8 border-b border-gray-100 pb-8"
>
  <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex flex-wrap gap-2">
    {searchQuery ? (
      <>
        Search results for <span className="text-rose-500 capitalize">{searchQuery}</span>
      </>
    ) : categoryQuery ? (
      <>
        <span className="text-rose-500 capitalize">{categoryQuery}</span> Escapes
      </>
    ) : (
      'Explore All Homes'
    )}
  </h1>
  
  <p className="text-gray-500 mt-2 text-base md:text-lg font-medium flex items-center gap-2">
    Discover {listings.length} {listings.length === 1 ? 'place' : 'places'} to stay
    
    {/* Optional: Agar search query hai toh aage ek chota sa dot aur extra text dikhane ke liye */}
    {(searchQuery || categoryQuery) && (
      <>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-1" />
        <span className="text-gray-400">Available right now</span>
      </>
    )}
  </p>
</motion.div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing, index) => {
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
        
        {/* 🔥 B&W Premium Loading Spinner */}
        {loading && (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-gray-900"></div>
            </div>
        )}
        
        {/* 🔥 Premium Empty State */}
        {!loading && listings.length === 0 && (
            <div className="text-center py-24 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FaHome className="text-gray-300 text-3xl" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or searching a different area.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default Listings;