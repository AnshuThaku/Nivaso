import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80";

export default function RecommendedListings({ currentListingId, API_URL }) {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Aapke general listings route se data utha kar current property ko filter kar denge
        const response = await axios.get(`${API_URL}/listings`);
        let allListings = [];
        
        if (response.data && response.data.success && Array.isArray(response.data.listings)) {
          allListings = response.data.listings;
        }

        // Current listing ko hatao aur baaki koi bhi 4 properties dikha do
        const filteredListings = allListings
          .filter(listing => listing._id !== currentListingId)
          .slice(0, 4);

        setRecommendations(filteredListings);
      } catch (error) {
        console.error("Error fetching recommendations:", error.message);
      }
    };

    if (currentListingId) {
      fetchRecommendations();
    }
  }, [currentListingId, API_URL]);

  if (recommendations.length === 0) return null; // Agar aur properties nahi hain toh kuch mat dikhao

  return (
    <div className="py-12 border-t border-gray-200 mt-8 overflow-hidden">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">More places you might like</h3>
      </div>

      {/* 🚀 HORIZONTAL SCROLL ON MOBILE, GRID ON DESKTOP */}
      <div 
        className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-8 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
      >
        {recommendations.map((listing, index) => {
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
              onClick={() => {
                navigate(`/listings/${listing._id}`);
                window.scrollTo(0, 0); // Naye page par jane pe top pe scroll kar dega
              }} 
              className="group cursor-pointer flex flex-col gap-3 min-w-[85%] sm:min-w-[45%] md:min-w-0 flex-shrink-0 snap-start"
            >
              <div className="relative w-full h-64 overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <img 
                  src={listingImage} 
                  alt={listing.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                />
              </div>

              <div className="flex flex-col px-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-base truncate pr-2">{location}</h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-900 shrink-0">
                    <Star size={12} className="fill-gray-900 text-gray-900" />
                    <span>{listing.rating || "4.8"}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs truncate mb-1">{listing.title}</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="font-bold text-gray-900 text-sm">{price}</span>
                  <span className="text-gray-500 text-xs">night</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}