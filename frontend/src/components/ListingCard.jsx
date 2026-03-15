import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const ListingCard = ({ listing }) => {
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
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative mb-3">
        <img
          src={listing.image.url}
          alt={listing.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
        <div className="absolute top-3 right-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(0,0,0,0.5)" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 hover:scale-110 transition active:scale-95">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        </div>
      </div>
      
      <div className="flex justify-between items-start">
         <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">{listing.location}, {listing.country}</h3>
         <div className="flex items-center gap-1 text-sm font-light">
             <FaStar size={12} /> <span>4.8</span>
         </div>
      </div>
      
      <p className="text-gray-500 text-sm truncate">{listing.category || "Beachfront"}</p>
      <p className="text-gray-500 text-sm">Nov 15-20</p>
      
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-sm font-semibold text-gray-900">₹{listing.price.toLocaleString("en-IN")}</span> 
        <span className="font-light text-gray-900 text-sm">night</span>
      </div>
      </motion.div>
    </Link>
  );
};

export default ListingCard;
