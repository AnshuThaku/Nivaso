import { useState } from "react";
import { FaTh, FaChevronLeft } from "react-icons/fa";

const ImageGallery = ({ imagesArray }) => {
  // Mobile par saari photos dekhne ke liye modal state
  const [showFullGallery, setShowFullGallery] = useState(false);

  // Agar 5 se kam images hain, toh fallback lagayenge taaki desktop grid na toote
  const displayImages = [
    imagesArray[0],
    imagesArray[1] || imagesArray[0],
    imagesArray[2] || imagesArray[0],
    imagesArray[3] || imagesArray[0],
    imagesArray[4] || imagesArray[0],
  ];

  return (
    <div className="mb-10">
        
        {/* 🔥 MOBILE VIEW: Ek Badi Photo + Show All Button */}
        <div className="md:hidden w-[100%] h-[300px] sm:h-[350px] rounded-2xl overflow-hidden relative shadow-sm">
            <img
                src={displayImages[0]?.url}
                alt="Main property view"
                className="w-full h-full object-cover"
            />
            {/* Show All Button (Sirf Mobile par) */}
            <button 
                onClick={() => setShowFullGallery(true)}
                className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 active:scale-95 transition"
            >
               <FaTh /> Show all
            </button>
        </div>

        {/* 🔥 DESKTOP VIEW: Airbnb Style Bento Grid (Button Hata Diya) */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[400px] lg:h-[450px] rounded-2xl overflow-hidden relative">
            
            <div className="col-span-2 row-span-2 relative cursor-pointer group overflow-hidden">
                <img src={displayImages[0]?.url} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            <div className="col-span-1 row-span-1 relative cursor-pointer group overflow-hidden">
                <img src={displayImages[1]?.url} alt="Thumbnail 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            <div className="col-span-1 row-span-1 relative cursor-pointer group overflow-hidden">
                <img src={displayImages[2]?.url} alt="Thumbnail 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            <div className="col-span-1 row-span-1 relative cursor-pointer group overflow-hidden">
                <img src={displayImages[3]?.url} alt="Thumbnail 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            <div className="col-span-1 row-span-1 relative cursor-pointer group overflow-hidden">
                <img src={displayImages[4]?.url} alt="Thumbnail 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
            
            {/* Desktop par se 'Show All' button remove kar diya gaya hai */}
        </div>

        {/* 🔥 MOBILE FULL SCREEN GALLERY (Right to Left Slide Animation) */}
        <div 
            className={`md:hidden fixed inset-0 z-[100] bg-white overflow-y-auto transition-transform duration-300 ease-in-out ${
                showFullGallery ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 z-10 shadow-sm">
                <button 
                    onClick={() => setShowFullGallery(false)}
                    className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FaChevronLeft size={18} />
                </button>
                <span className="font-semibold text-gray-900">All photos</span>
                <div className="w-8"></div> {/* Alignment ke liye empty space */}
            </div>

            {/* Vertical Scrollable Images */}
            <div className="flex flex-col gap-1 pb-10">
                {imagesArray.map((img, index) => (
                    <img 
                        key={index} 
                        src={img.url} 
                        alt={`Property photo ${index + 1}`} 
                        className="w-full h-auto object-cover"
                    />
                ))}
            </div>
        </div>

    </div>
  );
};

export default ImageGallery;