import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const ListingCard = ({ listing }) => {
  // 🔥 SAFETY CHECK: Image rendering logic
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0].url 
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=60"; 

  // TODO: Jab backend mein asli reviews aayenge, tab ise dynamic karna. Abhi ke liye 4.8 default.
  const rating = 4.8; 

  return (
    <Link to={`/listings/${listing._id}`} className="block w-full">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group relative cursor-pointer"
        >
          {/* Image Container */}
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative mb-3">
            <img
              src={imageUrl} 
              alt={listing.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            {/* Heart Icon (Save button) */}
            <div className="absolute top-3 right-3 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(0,0,0,0.5)" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 hover:scale-110 transition active:scale-95">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </div>
          </div>
          
          {/* 🔥 IMPROVED TEXT SECTION */}
          <div className="flex flex-col gap-0.5"> {/* Gap ko kam karke tight layout diya hai */}
            
            {/* Row 1: Location & Rating */}
            <div className="flex justify-between items-start">
               <h3 className="text-[15px] font-semibold text-gray-900 truncate pr-4">
                 {listing.location}, {listing.country}
               </h3>
               <div className="flex items-center gap-1 text-[14px] text-gray-900 shrink-0">
                   <FaStar size={12} /> 
                   <span>{rating}</span>
               </div>
            </div>
            
            {/* Row 2: Title / Category */}
            <p className="text-[15px] text-gray-500 truncate">
              {listing.title || listing.category || "Hosted by Nivaso"}
            </p>
            
            {/* Row 3: Dates */}
            <p className="text-[15px] text-gray-500 truncate">
              Nov 15-20 {/* TODO: Dynamic dates later */}
            </p>
            
            {/* Row 4: Price */}
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[15px] font-semibold text-gray-900">
                ₹{listing.price.toLocaleString("en-IN")}
              </span> 
              <span className="text-[15px] text-gray-900">
                night
              </span>
            </div>
          </div>

        </motion.div>
    </Link>
  );
};

export default ListingCard;