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

  if (loading) {
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
      
      {/* 🌟 Premium Header / Banner Section */}
      { <div className="bg-gray-900 h-22 md:h-34 w-full object-cover relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div> }

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
        
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6 border border-gray-100">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center text-6xl font-bold shadow-2xl border-4 border-white shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-grow pb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{user.username}</h1>
            <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
              {user.email} <span className="hidden md:inline">•</span> <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">Nivaso Member</span>
            </p>
          </div>
        </div>

        {/* 🌟 Modern Pill-shaped Tabs */}
        <div className="flex space-x-2 bg-gray-200/60 p-1.5 rounded-xl w-max mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("trips")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === "trips" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            <FaSuitcase className={activeTab === "trips" ? "text-rose-500" : "text-gray-400"} />
            My Trips
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === "settings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            <FaUserCog className={activeTab === "settings" ? "text-rose-500" : "text-gray-400"} />
            Account Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up">
          {activeTab === "trips" && (
            <div className="space-y-12">
              
              {/* Upcoming Trips */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Upcoming Reservations
                </h2>
                
                {upcomingTrips.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center">
                    <div className="bg-rose-50 h-20 w-20 rounded-full flex items-center justify-center mb-6">
                      <FaSuitcase className="text-rose-500 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming trips</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Time to dust off your bags and start planning your next great adventure with Nivaso.</p>
                    <Link to="/listings" className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-black transition-colors shadow-md hover:shadow-lg active:scale-95">
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
                <section className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-500">Username</div>
                  <div className="md:col-span-2 font-medium text-gray-900">{user.username}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-500">Email Address</div>
                  <div className="md:col-span-2 font-medium text-gray-900">{user.email}</div>
                </div>
                <div className="pt-4">
                  <button className="text-rose-600 font-semibold hover:text-rose-700 transition flex items-center gap-1">
                    Change Password <FaChevronRight size={12} className="mt-0.5" />
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

// 💳 The "Premium Ticket" Booking Card
const BookingCard = ({ booking, isPast }) => {
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  
  // Format dates beautifully (e.g., Oct 12)
  const formatOptions = { month: 'short', day: 'numeric' };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="h-56 overflow-hidden relative">
        <img 
          src={booking.listing?.image?.url || "https://images.unsplash.com/photo-1502672260266-1c1ea5250831?auto=format&fit=crop&w=800&q=80"} 
          alt={booking.listing?.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-md backdrop-blur-md ${
            booking.paymentStatus === "paid" ? "bg-white/90 text-green-700" : "bg-white/90 text-amber-600"
          }`}>
            {booking.paymentStatus === "paid" ? "CONFIRMED" : "PENDING"}
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-xl mb-1 truncate drop-shadow-md">{booking.listing?.title}</h3>
          <p className="text-white/90 text-sm flex items-center gap-1 drop-shadow-md">
            <FaMapMarkerAlt size={12} /> {booking.listing?.location}, {booking.listing?.country}
          </p>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Dates Block */}
        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-lg shadow-sm text-rose-500">
               <FaCalendarCheck size={18} />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Check-in</p>
               <p className="font-semibold text-gray-900">{checkIn.toLocaleDateString('en-US', formatOptions)}</p>
             </div>
          </div>
          
          <div className="w-px h-8 bg-gray-300"></div>
          
          <div className="flex items-start gap-3">
             <div className="text-right">
               <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Check-out</p>
               <p className="font-semibold text-gray-900">{checkOut.toLocaleDateString('en-US', formatOptions)}</p>
             </div>
             <div className="bg-white p-2 rounded-lg shadow-sm text-gray-500">
               <FaRegClock size={18} />
             </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-end border-t border-gray-100 pt-5">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Total Paid</p>
              <p className="font-bold text-xl text-gray-900">₹{booking.totalPrice?.toLocaleString('en-IN')}</p>
            </div>
            
            {isPast ? (
              <Link to={`/listings/${booking.listing?._id}`} className="text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors">
                Write Review
              </Link>
            ) : (
              <Link to={`/listings/${booking.listing?._id}`} className="text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                View Itinerary
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;