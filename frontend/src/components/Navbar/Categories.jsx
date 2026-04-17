import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryShowcase() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // API Call
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/listings`; 
        if (activeCategory !== 'All') {
          url = `${API_URL}/listings/filter/${activeCategory}`;
        }
        // Limit 6 rakhi hai taki page fast load ho
        const { data } = await axios.get(url, { params: { limit: 6 } }); 
        if (data) {
          setListings(data.listings || data); 
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [activeCategory]); 

  // Image Fallback Function
  const getListingImg = (listing) => {
    if (listing.images && listing.images.length > 0) return listing.images[0].url;
    if (listing.image && listing.image.url) return listing.image.url;
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'; 
  };

  // Price Format Function
  const formatPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(price);
  };

  const nivasoCategories = ['All', 'Trending', 'Rooms', 'Mountains', 'Castles', 'Pools', 'Camping', 'Farms'];

  // Card UI Component (Taki dono jagah reuse ho sake)
  const ListingCard = ({ listing }) => {
    const imgSrc = getListingImg(listing);
    const isRental = listing.type === 'rental';

    return (
      <div 
        className="bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full w-full"
        onClick={() => navigate(`/listings/${listing._id}`)}
      >
        <div className="w-full h-[240px] rounded-xl mb-4 overflow-hidden relative">
          <img src={imgSrc} alt={listing.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
          {listing.averageRating >= 4.5 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm text-gray-900">
              Guest Favorite
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-[14px] font-bold text-gray-900 truncate pr-2">{listing.location}, {listing.country}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={12} className="fill-gray-900 text-gray-900" />
              <span className="text-[13px] font-medium">{listing.averageRating || 'New'}</span>
            </div>
          </div>
          <p className="text-[13px] text-gray-500 mb-3 truncate">{listing.title}</p>
          <div className="mt-auto pt-3 border-t border-gray-50 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-extrabold text-gray-900">{formatPrice(listing.price)}</span>
              <span className="text-[12px] text-gray-500 font-medium">/ {isRental ? 'mo' : 'night'}</span>
            </div>
            {isRental && (
               <span className="text-[10px] font-bold tracking-wider text-rose-500 uppercase bg-rose-50 px-2 py-1 rounded-md">Rent</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-[#fbfbfb] py-12 md:py-16 px-4 md:px-12 font-sans overflow-hidden">
      <div className="w-full xl:max-w-[89%] mx-auto flex flex-col items-center">
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight text-center">Explore Categories</h2>
        <p className="text-gray-500 text-sm md:text-base text-center max-w-2xl mb-8 md:mb-12 px-2">
          From iconic city apartments to breathtaking mountain cabins, discover the perfect backdrop for your next unforgettable escape.
        </p>

        {/* ── CATEGORY FILTER TABS ── */}
        <div className="w-full max-w-5xl mb-10 md:mb-14">
          <div className="flex overflow-x-auto w-full justify-start md:justify-center gap-3 pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-3 min-w-max px-2">
              {nivasoCategories.map((catLabel) => (
                <button
                  key={catLabel}
                  onClick={() => setActiveCategory(catLabel)} 
                  className={`px-6 py-2.5 rounded-full text-[12px] font-bold tracking-[0.1em] transition-all duration-300 uppercase shadow-sm cursor-pointer shrink-0 ${
                    activeCategory === catLabel
                      ? 'bg-gray-900 text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {catLabel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── LISTING DISPLAY AREA ── */}
        {loading ? (
           <div className="flex justify-center items-center h-48">
             <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : listings.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-48 text-gray-500">
             <p className="text-lg font-medium">No listings found in this category.</p>
             <p className="text-sm mt-1">Try exploring other categories!</p>
           </div>
        ) : (
          <div className="w-full">
            
            {/* 💻 1. DESKTOP VIEW: Static Grid (No Slider) */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 w-full mb-10 justify-items-center">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {/* 📱 2. MOBILE VIEW: Swiper Slider with Buttons */}
            <div className="block md:hidden w-full mb-6 relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1.15} 
                centeredSlides={true}
                navigation={{
                  prevEl: '.mobile-prev-btn',
                  nextEl: '.mobile-next-btn',
                }}
                className="w-full pb-6 pt-2"
              >
                {listings.map((listing) => (
                  <SwiperSlide key={listing._id} className="flex justify-center">
                    <ListingCard listing={listing} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ONLY Mobile Slider Buttons */}
              <div className="flex justify-center gap-6 mt-4">
                <button className="mobile-prev-btn bg-white p-3.5 rounded-full shadow-md border border-gray-100 active:scale-90 transition-transform flex items-center justify-center">
                  <ChevronLeft size={20} className="text-gray-800" />
                </button>
                <button className="mobile-next-btn bg-white p-3.5 rounded-full shadow-md border border-gray-100 active:scale-90 transition-transform flex items-center justify-center">
                  <ChevronRight size={20} className="text-gray-800" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ── VIEW MORE BUTTON ── */}
        {!loading && listings.length > 0 && (
          <div className="flex justify-center w-full mt-8">
            <button 
              onClick={() => navigate('/listings')}
              className="bg-gray-900 text-white text-[12px] font-bold tracking-[0.15em] uppercase px-10 py-4 rounded-full hover:bg-black hover:shadow-xl transition-all duration-300"
            >
              Explore All Homes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}