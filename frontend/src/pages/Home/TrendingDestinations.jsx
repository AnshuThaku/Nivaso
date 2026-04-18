import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80";

export default function TrendingDestinations() {
  const [trendingListings, setTrendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingListings = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/listings`;
        const response = await axios.get(API_URL);
        let allListings = [];
        
        if (response.data && response.data.success && Array.isArray(response.data.listings)) {
          allListings = response.data.listings;
        }

        if (allListings.length === 0) {
          throw new Error("No listings found in the database.");
        }

        const topListings = allListings.slice(0, 4);
        setTrendingListings(topListings);
      } catch (error) {
        console.error("Error fetching trending listings:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingListings();
  }, []);

  // 🕒 Loading State (Skeleton Loader with Mobile Swipe)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* 🚀 Updated Container for Skeleton */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 overflow-x-auto md:overflow-visible pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 min-w-[85%] sm:min-w-[45%] md:min-w-0 flex-shrink-0">
              <div className="bg-gray-200 animate-pulse rounded-2xl h-72 w-full" />
              <div className="bg-gray-200 animate-pulse h-5 w-3/4 rounded-md" />
              <div className="bg-gray-200 animate-pulse h-4 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ⚠️ Empty State
  if (trendingListings.length === 0) {
     return (
       <section className="w-full bg-white py-16 md:py-24 text-center">
         <h2 className="text-2xl font-bold text-gray-400">No trending properties available right now.</h2>
       </section>
     );
  }

  return (
    <section className="w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-rose-500 font-bold text-xs tracking-widest uppercase mb-2 block">Highly Rated</span>
            <h2 className="text-4xl md:text-4xl font-black text-gray-900 tracking-tight">
              Trending <span className="text-rose-500">Stays.</span>
            </h2>
            <p className="text-gray-500 mt-2">Discover the most booked and loved properties by our guests.</p>
          </motion.div>
          
          <button 
            onClick={() => navigate('/listings')}
            className="hidden md:block mt-6 md:mt-0 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-rose-500 transition-all duration-300 shadow-lg shadow-gray-200"
          >
            Explore All
          </button>
        </div>

        {/* 🏡 Property Cards - 🚀 HORIZONTAL SCROLL ON MOBILE, GRID ON DESKTOP */}
        <div 
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-8 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Firefox & IE support for hidden scrollbar
        >
          {trendingListings.map((listing, index) => {
            
            let listingImage = FALLBACK_IMAGE;
            if (Array.isArray(listing.images) && listing.images.length > 0) {
                listingImage = listing.images[0].url; 
            }

            const price = listing.price ? `₹${listing.price.toLocaleString('en-IN')}` : "Price on request";
            const location = listing.location ? listing.location.split(',')[0] : "Location"; 

            return (
              <motion.div 
                key={listing._id || index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/listings/${listing._id}`)} 
                // 🚀 Nayi classes: min-w-[85%] mobile par width maintain karega, snap-start usko center karega swipe par
                className="group cursor-pointer flex flex-col gap-3 min-w-[85%] sm:min-w-[45%] md:min-w-0 flex-shrink-0 snap-start"
              >
                {/* Image Wrapper */}
                <div className="relative w-full h-72 md:h-80 overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <img 
                    src={listingImage} 
                    alt={listing.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  {/* Heart Icon */}
                  <div className="absolute top-4 right-4 text-white hover:text-rose-500 transition-colors drop-shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="flex flex-col px-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
                      {location}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 shrink-0">
                      <Star size={14} className="fill-gray-900 text-gray-900" />
                      <span>{listing.rating || "4.9"}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm truncate mb-1">
                    {listing.title}
                  </p>
                  
                  <div className="mt-1 flex items-center gap-1">
                    <span className="font-bold text-gray-900">{price}</span>
                    <span className="text-gray-500 text-sm">night</span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All Button (Shows only on mobile below the swiper) */}
        <button 
          onClick={() => navigate('/listings')}
          className="md:hidden w-full mt-2 py-4 bg-gray-900 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
        >
          Explore All Stays
        </button>

      </div>
    </section>
  );
}