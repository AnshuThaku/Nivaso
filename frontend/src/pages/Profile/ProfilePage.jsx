import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaSuitcase, FaUserCog, FaMapMarkerAlt, FaCalendarCheck, FaRegClock, FaChevronRight } from "react-icons/fa";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({ user: null, bookings: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trips"); // 'trips' or 'settings'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
          withCredentials: true, 
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading || !profileData.user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const { user, bookings } = profileData;

  // Safely filter bookings (in case a listing was deleted)
  const today = new Date();
  const validBookings = bookings.filter(b => b && b.listing);
  const upcomingTrips = validBookings.filter(b => new Date(b.checkIn) >= today);
  const pastTrips = validBookings.filter(b => new Date(b.checkIn) < today);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* 🌟 Premium Header / Banner Section (Updated to look more vibrant) */}
      <div className="h-32 md:h-48 w-full relative bg-gradient-to-r from-rose-600 via-rose-500 to-orange-400 overflow-hidden">
        {/* Decorative abstract shapes for the banner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
        
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6 border border-gray-100">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-white text-rose-500 flex items-center justify-center text-6xl font-black shadow-lg border-4 border-white shrink-0 relative overflow-hidden">
             {/* Initials fallback */}
             <span className="absolute z-0">{user.username.charAt(0).toUpperCase()}</span>
             {/* If user has an uploaded image, it will show here */}
             {user.image && <img src={user.image} alt={user.username} className="w-full h-full object-cover relative z-10" />}
          </div>
          <div className="text-center md:text-left flex-grow pb-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{user.username}</h1>
            <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2 text-sm md:text-base font-medium">
              {user.email} <span className="hidden md:inline text-gray-300">•</span> 
              <span className="bg-rose-50 px-3 py-1 rounded-full text-xs font-bold text-rose-600 tracking-wide">NIVASO MEMBER</span>
            </p>
          </div>
        </div>

        {/* 🌟 Modern Pill-shaped Tabs */}
        <div className="flex space-x-2 bg-white border border-gray-200 p-1.5 rounded-2xl w-max mb-8 overflow-x-auto shadow-sm">
          <button
            onClick={() => setActiveTab("trips")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "trips" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FaSuitcase className={activeTab === "trips" ? "text-white" : "text-gray-400"} />
            My Trips
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "settings" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FaUserCog className={activeTab === "settings" ? "text-white" : "text-gray-400"} />
            Account Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up">
          {activeTab === "trips" && (
            <div className="space-y-12">
              
              {/* Upcoming Trips */}
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                  Upcoming Reservations
                </h2>
                
                {upcomingTrips.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center">
                    <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mb-6">
                      <FaSuitcase className="text-gray-300 text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming trips</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Time to dust off your bags and start planning your next great adventure with Nivaso.</p>
                    <Link to="/listings" className="bg-rose-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-rose-700 transition-colors shadow-md hover:shadow-lg active:scale-95">
                      Start Exploring
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {upcomingTrips.map((booking) => (
                      <BookingCard key={booking._id} booking={booking} />
                    ))}
                  </div>
                )}
              </section>

              {/* Past Trips Section */}
              {pastTrips.length > 0 && (
                <section className="pt-10 border-t border-gray-200">
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                    Where you've been
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
                    {pastTrips.map((booking) => (
                      <BookingCard key={booking._id} booking={booking} isPast={true} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm max-w-3xl">
              <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Personal Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Username</div>
                  <div className="md:col-span-2 font-bold text-gray-900 text-lg">{user.username}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email Address</div>
                  <div className="md:col-span-2 font-bold text-gray-900 text-lg">{user.email}</div>
                </div>
                <div className="pt-4">
                  <button className="text-rose-600 font-bold hover:text-rose-700 transition flex items-center gap-1 group">
                    Change Password <FaChevronRight size={12} className="mt-0.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

// 💳 The "Premium Ticket" Booking Card (Made fully clickable and Image Fixed)
const BookingCard = ({ booking, isPast }) => {
  const navigate = useNavigate(); // 🚀 To handle card click
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  
  // Format dates beautifully (e.g., Oct 12)
  const formatOptions = { month: 'short', day: 'numeric' };

  // 🚀 IMAGE FIX: Array me se first image nikaalna
  let displayImage = "https://images.unsplash.com/photo-1502672260266-1c1ea5250831?auto=format&fit=crop&w=800&q=80";
  if (booking.listing?.images && booking.listing.images.length > 0) {
    displayImage = booking.listing.images[0].url;
  } else if (booking.listing?.image?.url) {
    displayImage = booking.listing.image.url;
  }
  
  return (
    <div 
      onClick={() => navigate(`/listings/${booking.listing?._id}`)} // 🚀 CARD CLICKABLE LOGIC
      className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="h-56 overflow-hidden relative bg-gray-100">
        <img 
          src={displayImage} // 🚀 FIXED IMAGE VARIABLE 
          alt={booking.listing?.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <span className={`px-3 py-1.5 rounded-full text-xs font-black tracking-widest shadow-md backdrop-blur-md uppercase ${
            booking.paymentStatus === "paid" ? "bg-white/95 text-emerald-600" : "bg-white/95 text-amber-600"
          }`}>
            {booking.paymentStatus === "paid" ? "Confirmed" : "Pending"}
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h3 className="font-bold text-xl mb-1.5 truncate drop-shadow-md">{booking.listing?.title}</h3>
          <p className="text-white/90 text-sm flex items-center gap-1.5 drop-shadow-md font-medium">
            <FaMapMarkerAlt size={12} className="text-rose-400" /> {booking.listing?.location}, {booking.listing?.country}
          </p>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Dates Block */}
        <div className="flex items-center justify-between bg-slate-50 border border-gray-100 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-xl shadow-sm text-gray-900 border border-gray-100">
               <FaCalendarCheck size={18} />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Check-in</p>
               <p className="font-bold text-gray-900">{checkIn.toLocaleDateString('en-US', formatOptions)}</p>
             </div>
          </div>
          
          <div className="w-px h-8 bg-gray-200"></div>
          
          <div className="flex items-start gap-3">
             <div className="text-right">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Check-out</p>
               <p className="font-bold text-gray-900">{checkOut.toLocaleDateString('en-US', formatOptions)}</p>
             </div>
             <div className="bg-white p-2 rounded-xl shadow-sm text-gray-400 border border-gray-100">
               <FaRegClock size={18} />
             </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center border-t border-gray-100 pt-5">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Paid</p>
              <p className="font-black text-xl text-gray-900">₹{booking.totalPrice?.toLocaleString('en-IN')}</p>
            </div>
            
            {/* View Button Logic (Now inside clickable card, acts as a visual prompt) */}
            <div className="shrink-0">
              {isPast ? (
                <span className="text-sm font-bold text-rose-600 bg-rose-50 px-4 py-2.5 rounded-xl transition-colors group-hover:bg-rose-100">
                  Write Review
                </span>
              ) : (
                <span className="text-sm font-bold text-gray-800 bg-gray-100 px-4 py-2.5 rounded-xl transition-colors group-hover:bg-gray-200">
                  View Stay
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;