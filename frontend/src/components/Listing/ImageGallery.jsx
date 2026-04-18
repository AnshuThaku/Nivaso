import { useState, useEffect } from "react";
import { FaTh, FaTimes, FaShareAlt, FaHeart } from "react-icons/fa"; // Premium Icons switch
import { motion, AnimatePresence } from "framer-motion"; // 🔥 Animations ke liye

const ImageGallery = ({ imagesArray, listingTitle }) => {
  // Mobile par saari photos dekhne ke liye modal state
  const [showFullGallery, setShowFullGallery] = useState(false);

  // 🚀 Lock body scroll when gallery is open
  useEffect(() => {
    if (showFullGallery) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showFullGallery]);

  // Agar 5 se kam images hain, toh fallback lagayenge taaki desktop grid na toote
  const displayImages = [
    imagesArray[0],
    imagesArray[1] || imagesArray[0],
    imagesArray[2] || imagesArray[0],
    imagesArray[3] || imagesArray[0],
    imagesArray[4] || imagesArray[0],
  ];

  return (
    <div className="mb-10 mt-6 relative z-10">
        
        {/* 🔥 MOBILE VIEW: Ek Badi Photo + Show All Button */}
        <div className="md:hidden w-[100%] h-[280px] sm:h-[350px] rounded-2xl overflow-hidden relative shadow-md">
            <img
                src={displayImages[0]?.url}
                alt="Main property view"
                className="w-full h-full object-cover"
            />
            {/* Show All Button (Sirf Mobile par) */}
            <button 
                onClick={() => setShowFullGallery(true)}
                className="absolute bottom-4 right-4 bg-white/95 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all border border-gray-100"
            >
                <FaTh className="text-rose-500" /> Show all photos
            </button>
        </div>

        {/* 🔥 DESKTOP VIEW: Airbnb Style Bento Grid */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2.5 h-[400px] lg:h-[480px] rounded-3xl overflow-hidden relative group">
            
            <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden">
                <img src={displayImages[0]?.url} alt="Main" className="w-full h-full object-cover group-hover:opacity-95 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </div>

            {[1, 2, 3, 4].map((index) => (
                <div key={index} className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden">
                    <img src={displayImages[index]?.url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover group-hover:opacity-95 transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </div>
            ))}
            
            {/* Desktop 'Show All' Button (Pill style, bottom right) */}
            <button 
                onClick={() => setShowFullGallery(true)}
                className="absolute bottom-6 right-6 bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2.5 hover:bg-slate-50 active:scale-95 transition-all z-20"
            >
                <FaTh className="text-gray-700" /> Show all photos
            </button>
        </div>

        {/* 🔥 PREMIUM FULL SCREEN GALLERY PAGE (Animated Open) */}
        <AnimatePresence>
          {showFullGallery && (
            <motion.div 
                initial={{ opacity: 0, y: "100%" }} // Niche se shuru
                animate={{ opacity: 1, y: 0 }} // Upar aake ruke
                exit={{ opacity: 0, y: "100%" }} // Niche wapas jaye close hone pe
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-0 z-[1000] bg-slate-50 overflow-y-auto"
            >
                {/* 🚀 Sticky Header (Looks like a Page Header) */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-md px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-100 z-50 shadow-sm">
                    <button 
                        onClick={() => setShowFullGallery(false)}
                        className="p-3 -ml-3 text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
                    >
                        <FaTimes size={18} />
                    </button>
                    
                    {/* Center Title (feel like a page) */}
                    <div className="text-center">
                      <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">Photo Gallery</p>
                      <h4 className="font-extrabold text-gray-900 text-sm md:text-base truncate max-w-[200px] md:max-w-xs">{listingTitle || "Property Overview"}</h4>
                    </div>

                    {/* Right Actions (Page feel) */}
                    <div className="flex items-center gap-2">
                      <button className="p-3 text-gray-700 hover:bg-gray-100 rounded-full transition">
                        <FaShareAlt size={16} />
                      </button>
                      <button className="p-3 text-gray-700 hover:bg-gray-100 rounded-full transition">
                        <FaHeart size={16} />
                      </button>
                    </div>
                </div>

                {/* 🚀 Vertical Scrollable Content */}
                <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
                  
                  {/* Gallery Grid Structure */}
                  <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
                    
                    {/* Images Column */}
                    <div className="flex flex-col gap-4">
                        {imagesArray.map((img, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-100px" }}
                              className="w-full bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                              <img 
                                  src={img.url} 
                                  alt={`Property photo ${index + 1}`} 
                                  className="w-full h-auto object-cover rounded-xl"
                                  loading="lazy"
                              />
                            </motion.div>
                        ))}
                    </div>

                    {/* 🚀 Right Side: Sticky Content (To make it feel like a page, not just images) */}
                    <div className="hidden md:block">
                      <div className="sticky top-28 space-y-6">
                        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Photo Highlights</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Explore all {imagesArray.length} high-resolution photos of this beautiful property, capturing every detail from the cozy interiors to the breathtaking exterior views.
                          </p>
                        </div>
                        
                        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
                          <h4 className="font-semibold text-gray-900 mb-4">Jump to section</h4>
                          <div className="space-y-2.5 text-sm text-gray-800">
                              <p className="hover:text-rose-500 cursor-pointer">• Exterior & Views</p>
                              <p className="hover:text-rose-500 cursor-pointer">• Living Area</p>
                              <p className="hover:text-rose-500 cursor-pointer">• Bedrooms</p>
                              <p className="hover:text-rose-500 cursor-pointer">• Amenities</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
};

export default ImageGallery;