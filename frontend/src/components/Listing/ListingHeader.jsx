import { useNavigate } from "react-router-dom";
import { FaStar, FaShare, FaHeart } from "react-icons/fa"; // FaArrowLeft hata diya

const ListingHeader = ({ title, location, country, reviewsCount }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Title Header - Upar se margin thodi adjust ki hai clean look ke liye */}
      <div className="mb-4 mt-4 md:mt-4">
           <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">{title}</h1>
           <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-800 gap-2">
               <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-semibold flex items-center gap-1"><FaStar className="text-sm" /> 4.8</span>
                   <span className="hidden md:inline">·</span>
                   <span className="font-semibold underline cursor-pointer">{reviewsCount} reviews</span>
                   <span className="hidden md:inline">·</span>
                   <span className="font-semibold underline cursor-pointer flex items-center gap-1">{location}, {country}</span>
               </div>
               <div className="flex gap-4 mt-2 md:mt-0">
                   <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md font-semibold underline transition-colors"><FaShare /> Share</button>
                   <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md font-semibold underline transition-colors"><FaHeart /> Save</button>
               </div>
           </div>
      </div>
    </>
  );
};

export default ListingHeader;